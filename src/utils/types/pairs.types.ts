import { FilterQuery } from 'mongoose';

import { AffinityMetricsByGroups, DataEntry } from './shared.types';
import { PairsAffinityEnum } from '../enums';
import { PairsAffinity, PairsRanking } from '../../modules/pairs/pairs.schema';

export type PairsAffinityByPairs = AffinityMetricsByGroups<
  PairsAffinityEnum.Pair,
  PairsAffinityEnum.Dimension
>;

export type PairsAffinityResponse = {
  rawData: PairsAffinity[];
  dataByPairsAndDimension: Record<string, unknown>[];
  dataInTimeByAffinity: DataEntry[];
  dataInTimeByTexts: DataEntry[];
  dataByPairs: PairsAffinityByPairs[];
  fullQuery: FilterQuery<PairsAffinity>;
  count: number;
};

export type PairsRankingResponse = {
  rawData: PairsRanking[];
  dataByRanking: Record<string, unknown>[];
  fullQuery: FilterQuery<PairsRanking>;
  count: number;
};
