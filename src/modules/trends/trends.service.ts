import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  Filters,
  getDataByCity,
  getDBData,
  getMongoQuery,
  MongoCollections,
  trendsPeaceQueryKeys,
  trendsHumanRightsQueryKeys,
  TrendsGeneralEnum,
  trendsGeneralQueryKeys,
  TrendsPeaceEnum,
  getDataByTrends,
  getDataInTime,
  LocationDataKeys,
  getDataByRiskAndImpcat,
  TrendsHumanRightsEnum,
  getDataByHumanRight,
  CommonMongoKeys,
  calculateGroupedMetrics,
  TrendsHumanRightsByCity,
  TrendsHumanRightsResponse,
  TrendsPeaceResponse,
  TrendsGeneralResponse,
  getDataCountByKey,
  TrendsPeaceByCorp,
  TrendsPeaceByConversation,
  MapChartData,
} from 'src/utils';

import { TrendsGeneral, TrendsHumanRights, TrendsPeace } from './trends.schema';

@Injectable()
export class TrendsService {
  constructor(
    @InjectModel(MongoCollections.TrendsGeneral)
    private trendsGeneralModel: Model<TrendsGeneral>,
    @InjectModel(MongoCollections.TrendsHumanRights)
    private trendsHumanRightsModel: Model<TrendsHumanRights>,
    @InjectModel(MongoCollections.TrendsPeace)
    private trendsPieceModel: Model<TrendsPeace>,
  ) {}

  async findGeneralData(filters: Filters): Promise<TrendsGeneralResponse> {
    const query = getMongoQuery(filters, 7, trendsGeneralQueryKeys);

    const rawData = await getDBData<TrendsGeneral>(
      this.trendsGeneralModel,
      query,
    );

    const dataByTrends = getDataByTrends(
      rawData,
      filters.extraFilters[TrendsGeneralEnum.TrendTopic] || [],
    );

    const dataInTimeByRecurrence = getDataInTime<TrendsGeneral>(
      rawData,
      filters.extraFilters[TrendsGeneralEnum.TrendTopic] || [],
      TrendsGeneralEnum.TrendTopic,
    );

    return {
      rawData,
      dataByTrends,
      dataInTimeByRecurrence,
      fullQuery: query,
      count: rawData.length,
    };
  }

  async findHumanRightsData(
    filters: Filters,
  ): Promise<TrendsHumanRightsResponse> {
    const query = getMongoQuery(filters, 7, trendsHumanRightsQueryKeys);

    const rawData = await getDBData<TrendsHumanRights>(
      this.trendsHumanRightsModel,
      query,
    );

    const dataByRiskAndImpact = getDataByRiskAndImpcat(
      rawData,
      filters.extraFilters[TrendsHumanRightsEnum.HumanRight] || [],
    );

    const dataByCity = getDataByCity<TrendsHumanRights>(
      rawData,
      [
        { accessor: LocationDataKeys.Impact, name: 'impact' },
        { accessor: LocationDataKeys.Risk, name: 'risk' },
      ],
      undefined,
      filters.extraFilters[TrendsHumanRightsEnum.HumanRight] || [],
    ) as TrendsHumanRightsByCity;

    const dataInTimeByRisk = getDataInTime<TrendsHumanRights>(
      rawData,
      filters.extraFilters[TrendsHumanRightsEnum.HumanRight] || [],
      TrendsHumanRightsEnum.HumanRight,
      TrendsHumanRightsEnum.RiskIndex,
    );

    const dataInTimeByImpact = getDataInTime<TrendsHumanRights>(
      rawData,
      filters.extraFilters[TrendsHumanRightsEnum.HumanRight] || [],
      TrendsHumanRightsEnum.HumanRight,
      TrendsHumanRightsEnum.ImpactIndex,
    );

    const dataByHumanRight = getDataByHumanRight(
      rawData,
      filters.extraFilters[TrendsHumanRightsEnum.HumanRight] || [],
      filters.extraFilters[CommonMongoKeys.Location] || [],
    );

    return {
      rawData,
      dataByRiskAndImpact,
      dataByCity,
      dataInTimeByRisk,
      dataInTimeByImpact,
      dataByHumanRight,
      fullQuery: query,
      count: rawData.length,
    };
  }

  async findPeaceData(filters: Filters): Promise<TrendsPeaceResponse> {
    const query = getMongoQuery(filters, 1, trendsPeaceQueryKeys, {
      $or: [
        { [TrendsPeaceEnum.PeaceActor]: { $ne: null } },
        { [TrendsPeaceEnum.PeaceConv]: { $ne: null } },
      ],
    });

    const rawData = await getDBData<TrendsPeace>(this.trendsPieceModel, query);

    const dataByConversationAndActor = calculateGroupedMetrics<TrendsPeace>(
      rawData,
      TrendsPeaceEnum.PeaceConv,
      TrendsPeaceEnum.PeaceActor,
      filters.extraFilters[TrendsPeaceEnum.PeaceConv] || [],
      filters.extraFilters[TrendsPeaceEnum.PeaceActor] || [],
      true
    );

    const dataByCorp = getDataCountByKey<TrendsPeace>(
      rawData,
      filters.extraFilters[TrendsPeaceEnum.Corps] || [],
      TrendsPeaceEnum.Corps,
    ) as TrendsPeaceByCorp[];

    const dataByConversation = getDataCountByKey<TrendsPeace>(
      rawData,
      filters.extraFilters[TrendsPeaceEnum.PeaceConv] || [],
      TrendsPeaceEnum.PeaceConv,
      {
        key: TrendsPeaceEnum.PeaceActor,
        filter: 'FARC-EP',
      },
    ) as TrendsPeaceByConversation[];

    const dataByCity = getDataByCity<TrendsPeace>(
      rawData,
      [{}],
      'state',
    ) as MapChartData[];

    return {
      rawData,
      dataByConversationAndActor,
      dataByCorp,
      dataByConversation,
      dataByCity,
      fullQuery: query,
      count: rawData.length,
    };
  }
}
