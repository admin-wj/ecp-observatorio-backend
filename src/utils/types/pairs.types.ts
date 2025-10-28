import {
  AffinityMetricsByGroups,
  DataEntry,
  ResponseBase,
} from './shared.types';
import { PairsAffinityEnum } from '../enums';
import { PairsAffinity, PairsRanking } from '../../modules/pairs/pairs.schema';

export type PairsAffinityByPairs = AffinityMetricsByGroups<
  PairsAffinityEnum.Pair,
  PairsAffinityEnum.Dimension
>;

export type PairsAffinityResponse = ResponseBase<
  PairsAffinity,
  {
    dataByPairsAndDimension: Record<string, unknown>[];
    dataInTimeByAffinity: DataEntry[];
    dataInTimeByTexts: DataEntry[];
    dataByPairs: PairsAffinityByPairs[];
  }
>;

export type PairsRankingResponse = ResponseBase<
  PairsRanking,
  {
    dataByRanking: Record<string, unknown>[];
  }
>;

export type PairsAffinityReport = {
  peer_summary: string;
  peer_dimension: Record<string, string[]>;
  time_analysis: Record<string, string[]>;
};

export type PairsRankingReport = {
  ranking_summary: string;
};
