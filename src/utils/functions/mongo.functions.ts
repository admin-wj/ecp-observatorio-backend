import { FilterQuery, Model, SortOrder } from 'mongoose';

import { getDateRangeQuery } from './dates.functions';
import { Filters, QueryKeys, QueryParams } from '../types/shared.types';
import { defaultParamsKeys } from '../constants/mongodb.constants';

export const getDBData = <T>(
  model: Model<T>,
  query: FilterQuery<unknown>,
  customSort?: Record<string, SortOrder>,
) =>
  model
    .find(query, { embedding_vector: 0 })
    .sort(customSort ?? { timestamp: 1 })
    .lean<T[]>()
    .exec();

export const parseFilters = (raw: QueryParams): Filters => ({
  dates: {
    startDate: Array.isArray(raw?.startDate)
      ? raw.startDate[0]
      : raw?.startDate,
    endDate: Array.isArray(raw?.endDate) ? raw.endDate[0] : raw?.endDate,
  },
  needsPastData: raw.needs_past_data === 'true',
  extraFilters: Object.fromEntries(
    Object.entries(raw)
      .filter(([k]) => !defaultParamsKeys.includes(k))
      .map(([k, v]) => [k, Array.isArray(v) ? v : v ? [v] : []]),
  ),
});

export const getMongoFilter = (
  value: string[],
  type: 'array' | 'array-ne' | 'string' | 'string-ne' = 'array',
) => {
  if (!value || value.length === 0) return { $ne: null };
  if (type === 'array') {
    return { $elemMatch: { $in: value } };
  } else if (type === 'array-ne') {
    return { $elemMatch: { $in: value }, $ne: null };
  } else {
    return { $in: value };
  }
};

export const getMongoQuery = (
  filters: Filters,
  defaultDateRange: number,
  keys: QueryKeys,
  customQuery?: FilterQuery<unknown>,
): FilterQuery<unknown> => {
  const { dates, needsPastData, extraFilters } = filters;
  const { main, arrayNotEmpty, stringsNotEmpty, strings } = keys;
  const extraFilterKeys = Object.keys(extraFilters);
  if (main && !extraFilterKeys.includes(main)) extraFilterKeys.push(main);

  return {
    ...getDateRangeQuery(dates, needsPastData, defaultDateRange),
    ...extraFilterKeys.reduce((acc, el) => {
      if (el === 'state_id') {
        if (
          extraFilters[el].length > 0 &&
          (!extraFilters['location_id'] ||
            extraFilters['location_id']?.length === 0)
        ) {
          const hasNull = extraFilters[el].includes('null');
          const nonNullValues = extraFilters[el].filter(
            (val: string) => val !== 'null',
          );

          if (hasNull && nonNullValues.length > 0) {
            return {
              ...acc,
              $or: [
                { location_id: null },
                {
                  location_id: {
                    $regex: `^(${nonNullValues.join('|')})`,
                    $options: 'i',
                  },
                },
              ],
            };
          } else if (hasNull) {
            acc['location_id'] = null;
          } else {
            acc['location_id'] = {
              $regex: `^(${extraFilters[el].join('|')})`,
              $options: 'i',
            };
          }
        }
      } else if (arrayNotEmpty?.includes(el))
        acc[el] = getMongoFilter(extraFilters[el], 'array-ne');
      else if (stringsNotEmpty?.includes(el))
        acc[el] = getMongoFilter(extraFilters[el], 'string-ne');
      else if (strings?.includes(el))
        acc[el] = getMongoFilter(extraFilters[el], 'string');
      else acc[el] = getMongoFilter(extraFilters[el]);

      if (!acc[el]) delete acc[el];
      return acc;
    }, {}),
    ...(customQuery || {}),
  };
};
