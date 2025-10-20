import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  calculateAffinityMetricsByGroups,
  calculateGroupedMetrics,
  ecopetrolAffinityQueryKeys,
  EcopetrolAffinityResponse,
  EcopetrolByDimension,
  EcopetrolByMateriality,
  EcopetrolEnum,
  ecopetrolMaterialityQueryKeys,
  EcopetrolMaterialityResponse,
  Filters,
  getDBData,
  getDataByCity,
  getDataInTime,
  getMongoQuery,
  LocationDataKeys,
  MapChartData,
  MongoCollections,
} from 'src/utils';

import { Ecopetrol } from './ecopetrol.schema';

@Injectable()
export class EcopetrolService {
  constructor(
    @InjectModel(MongoCollections.Ecopetrol)
    private ecopetrolModel: Model<Ecopetrol>,
  ) {}

  async findAffinityData(filters: Filters): Promise<EcopetrolAffinityResponse> {
    const query = getMongoQuery(filters, 30, ecopetrolAffinityQueryKeys);

    const rawData = await getDBData<Ecopetrol>(
      this.ecopetrolModel,
      query,
      undefined,
    );

    const dataByGroup = calculateGroupedMetrics<Ecopetrol>(
      rawData,
      EcopetrolEnum.GInterest,
      EcopetrolEnum.Dimension,
      filters.extraFilters[EcopetrolEnum.GInterest] || [],
      filters.extraFilters[EcopetrolEnum.Dimension] || [],
    );

    const dataByDimension = calculateAffinityMetricsByGroups<Ecopetrol>(
      rawData,
      EcopetrolEnum.GInterest,
      EcopetrolEnum.Dimension,
      filters.extraFilters[EcopetrolEnum.GInterest] || [],
      filters.extraFilters[EcopetrolEnum.Dimension] || [],
      dataByGroup,
    ) as EcopetrolByDimension[];

    const dataInTimeByInterestGroup = getDataInTime<Ecopetrol>(
      rawData,
      filters.extraFilters[EcopetrolEnum.GInterest] || [],
      EcopetrolEnum.GInterest,
    );

    const dataInTimeByDimension = getDataInTime<Ecopetrol>(
      rawData,
      filters.extraFilters[EcopetrolEnum.Dimension] || [],
      EcopetrolEnum.Dimension,
    );

    const dataByCity = getDataByCity<Ecopetrol>(
      rawData,
      [{ accessor: LocationDataKeys.Affinity }],
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
    const query = getMongoQuery(filters, 30, ecopetrolMaterialityQueryKeys);

    const rawData = await getDBData<Ecopetrol>(
      this.ecopetrolModel,
      query,
      undefined,
    );

    const dataByGroup = calculateGroupedMetrics<Ecopetrol>(
      rawData,
      EcopetrolEnum.GInterest,
      EcopetrolEnum.Material,
      filters.extraFilters[EcopetrolEnum.GInterest] || [],
      filters.extraFilters[EcopetrolEnum.Material] || [],
    );

    const dataInTimeByGI = getDataInTime<Ecopetrol>(
      rawData,
      [],
      EcopetrolEnum.GInterest,
    );

    const dataInTimeByMateriality = getDataInTime<Ecopetrol>(
      rawData,
      filters.extraFilters[EcopetrolEnum.Material] || [],
      EcopetrolEnum.Material,
    );

    const dataByMateriality = calculateAffinityMetricsByGroups<Ecopetrol>(
      rawData,
      EcopetrolEnum.GInterest,
      EcopetrolEnum.Material,
      filters.extraFilters[EcopetrolEnum.GInterest] || [],
      filters.extraFilters[EcopetrolEnum.Material] || [],
      dataByGroup,
    ) as EcopetrolByMateriality[];

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
