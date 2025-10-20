import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  calculateAffinityMetricsByGroups,
  calculateGroupedMetrics,
  Filters,
  getDataByRanking,
  getDataInTime,
  getDBData,
  getMongoQuery,
  MongoCollections,
  PairsAffinityByPairs,
  PairsAffinityEnum,
  pairsAffinityQueryKeys,
  PairsAffinityResponse,
  PairsRankingEnum,
  pairsRankingQueryKeys,
  PairsRankingResponse,
} from 'src/utils';

import { PairsAffinity, PairsRanking } from './pairs.schema';

@Injectable()
export class PairsService {
  constructor(
    @InjectModel(MongoCollections.PairsAffinity)
    private pairsAffinityModel: Model<PairsAffinity>,
    @InjectModel(MongoCollections.PairsRanking)
    private pairsRankingModel: Model<PairsRanking>,
  ) {}

  async findAffinityData(filters: Filters): Promise<PairsAffinityResponse> {
    const query = getMongoQuery(filters, 30, pairsAffinityQueryKeys);

    const rawData = await getDBData<PairsAffinity>(
      this.pairsAffinityModel,
      query,
    );

    const dataByPairsAndDimension = calculateGroupedMetrics<PairsAffinity>(
      rawData,
      PairsAffinityEnum.Pair,
      PairsAffinityEnum.Dimension,
      filters.extraFilters[PairsAffinityEnum.Pair] || [],
      filters.extraFilters[PairsAffinityEnum.Dimension] || [],
    );

    const dataInTimeByAffinity = getDataInTime<PairsAffinity>(
      rawData,
      filters.extraFilters[PairsAffinityEnum.Pair],
      PairsAffinityEnum.Pair,
    );

    const dataInTimeByTexts = getDataInTime<PairsAffinity>(
      rawData,
      filters.extraFilters[PairsAffinityEnum.Pair] || [],
      PairsAffinityEnum.Pair,
      'count',
    );

    const dataByPairs = calculateAffinityMetricsByGroups<PairsAffinity>(
      rawData,
      PairsAffinityEnum.Pair,
      PairsAffinityEnum.Dimension,
      filters.extraFilters[PairsAffinityEnum.Pair] || [],
      filters.extraFilters[PairsAffinityEnum.Dimension] || [],
      dataByPairsAndDimension,
    ) as PairsAffinityByPairs[];

    return {
      rawData,
      dataByPairsAndDimension,
      dataInTimeByAffinity,
      dataInTimeByTexts,
      dataByPairs,
      fullQuery: query,
      count: rawData.length,
    };
  }

  async findRankingData(filters: Filters): Promise<PairsRankingResponse> {
    const query = getMongoQuery(filters, 365, pairsRankingQueryKeys);

    const rawData = await getDBData<PairsRanking>(
      this.pairsRankingModel,
      query,
      {
        timestamp: -1,
        score_100: 1,
      },
    );

    const dataByRanking = getDataByRanking(
      rawData,
      filters.extraFilters[PairsRankingEnum.Pair] || [],
    );

    return {
      rawData: rawData.map((d) => ({
        ...d,
        [PairsRankingEnum.Score100]:
          typeof d[PairsRankingEnum.Score100] === 'number'
            ? Number(d[PairsRankingEnum.Score100].toFixed(2))
            : d[PairsRankingEnum.Score100],
      })),
      dataByRanking,
      fullQuery: query,
      count: rawData.length,
    };
  }
}
