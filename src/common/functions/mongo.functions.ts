import { FilterQuery, Model, SortOrder } from 'mongoose';
import { Filters, QueryParams } from '../types/shared.types';
import { defaultParamsKeys } from '../constants/mongodb.constants';

export const getDBData = (
  model: Model<any>,
  query: FilterQuery<unknown>,
  customSort?: Record<string, SortOrder>,
) =>
  model
    .find(query, { embedding_vector: 0 })
    .sort(customSort ?? { timestamp: 1 })
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
  value?: string[],
  type: 'array' | 'array-ne' | 'string' = 'array',
) => {
  if (value && value.length) {
    if (type === 'array') {
      return { $elemMatch: { $in: value } };
    } else if (type === 'array-ne') {
      return { $elemMatch: { $in: value }, $ne: null };
    } else {
      return { $in: value };
    }
  } else if (type === 'array-ne') {
    return { $ne: null };
  }
};
