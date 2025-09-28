import { Model, FilterQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  calculateAffinityMetricsByGroups,
  calculateGroupedMetrics,
  ecopetrolStringValuesKeys,
  Filters,
  getDBData,
  getDateRangeQuery,
  getMongoFilter,
  getDataByCity,
  LocationDataKeys,
  getDataInTime,
  getDataByMateriality,
  MapChartData,
} from 'src/common';

import {
  Ecopetrol,
  EcopetrolAffinityResponse,
  EcopetrolByDimension,
  EcopetrolDocument,
  EcopetrolMaterialityResponse,
} from './ecopetrol.schema';

@Injectable()
export class EcopetrolService {
  constructor(
    @InjectModel('df_ecp') private ecopetrolModel: Model<Ecopetrol>,
  ) {}

  async findAffinityData(filters: Filters): Promise<EcopetrolAffinityResponse> {
    const { dates, needsPastData, extraFilters } = filters;

    const extraFilterKeys = Object.keys(extraFilters);
    if (!extraFilterKeys.includes('dimension'))
      extraFilterKeys.push('dimension');

    const query: FilterQuery<EcopetrolDocument> = {
      ...getDateRangeQuery(dates, needsPastData, 30),
      ...extraFilterKeys.reduce((acc, el) => {
        if (el === 'dimension')
          acc[el] = getMongoFilter(extraFilters[el], 'array-ne');
        else if (ecopetrolStringValuesKeys.includes(el))
          acc[el] = getMongoFilter(extraFilters[el], 'string');
        else acc[el] = getMongoFilter(extraFilters[el]);

        if (!acc[el]) delete acc[el];
        return acc;
      }, {}),
    };

    const rawData = await getDBData(this.ecopetrolModel, query, undefined);

    const dataByGroup = calculateGroupedMetrics(
      rawData,
      'g_interest',
      'dimension',
      filters.extraFilters.g_interest || [],
      filters.extraFilters.dimension || [],
    );

    const dataByDimension = calculateAffinityMetricsByGroups(
      rawData,
      'g_interest',
      'dimension',
      filters.extraFilters.g_interest || [],
      filters.extraFilters.dimension || [],
    ).map((v) => {
      const g_interest = dataByGroup.find((d) => d.id === v.g_interest);
      if (g_interest) v.affinity = g_interest.General as number;
      return v;
    }) as EcopetrolByDimension[];

    const dataInTimeByInterestGroup = getDataInTime(
      rawData,
      filters.extraFilters.g_interest || [],
      'g_interest',
    );
    const dataInTimeByDimension = getDataInTime(
      rawData,
      filters.extraFilters.dimension || [],
      'dimension',
    );
    const dataByCity = getDataByCity(
      rawData,
      [{ accessor: LocationDataKeys.AFFINITY }],
      'name',
    ) as MapChartData[];

    return {
      rawData,
      dataByGroup,
      dataByDimension,
      dataInTimeByInterestGroup,
      dataInTimeByDimension,
      dataByCity,
      fullQuery: query,
      count: rawData.length,
    };
  }

  async findMaterialityData(
    filters: Filters,
  ): Promise<EcopetrolMaterialityResponse> {
    const { dates, needsPastData, extraFilters } = filters;

    const extraFilterKeys = Object.keys(extraFilters);
    if (!extraFilterKeys.includes('material')) extraFilterKeys.push('material');

    const query: FilterQuery<EcopetrolDocument> = {
      ...getDateRangeQuery(dates, needsPastData, 30),
      ...extraFilterKeys.reduce((acc, el) => {
        if (el === 'material' || el === 'submaterial')
          acc[el] = getMongoFilter(extraFilters[el], 'array-ne');
        else if (ecopetrolStringValuesKeys.includes(el))
          acc[el] = getMongoFilter(extraFilters[el], 'string');
        else acc[el] = getMongoFilter(extraFilters[el]);

        if (!acc[el]) delete acc[el];
        return acc;
      }, {}),
    };

    const rawData: Ecopetrol[] = await getDBData(
      this.ecopetrolModel,
      query,
      undefined,
    );

    const dataByGroup = calculateGroupedMetrics(
      rawData,
      'g_interest',
      'material',
      filters.extraFilters.g_interest || [],
      filters.extraFilters.material || [],
    );

    const dataInTimeByGI = getDataInTime(rawData, [], 'g_interest');

    const dataInTimeByMateriality = getDataInTime(
      rawData,
      filters.extraFilters.materials || [],
      'material',
    );

    const dataByMateriality = getDataByMateriality(
      rawData,
      filters.extraFilters.material || [],
      filters.extraFilters.g_interest || [],
      dataByGroup,
    );

    return {
      rawData,
      dataByGroup,
      dataInTimeByGI,
      dataInTimeByMateriality,
      dataByMateriality,
      fullQuery: query,
      count: rawData.length,
    };
  }
}
