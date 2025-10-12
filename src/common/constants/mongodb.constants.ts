import {
  CommonMongoKeys,
  EcopetrolEnum,
  PairsAffinityEnum,
  PairsRankingEnum,
  VTTEnum,
} from '../enums';
import { QueryKeys } from '../types';

export const defaultParamsKeys = ['startDate', 'endDate', 'needsPastData'];

export const ecopetrolStringKeys = [
  CommonMongoKeys.Location,
  EcopetrolEnum.SourceType,
  EcopetrolEnum.SourceCategory,
];

// Query Keys:
export const ecopetrolAffinityQueryKeys: QueryKeys = {
  main: EcopetrolEnum.Dimension,
  arrayNotEmpty: [EcopetrolEnum.Dimension],
  stringsNotEmpty: [],
  strings: ecopetrolStringKeys,
};

export const ecopetrolMaterialityQueryKeys: QueryKeys = {
  main: EcopetrolEnum.Material,
  arrayNotEmpty: [EcopetrolEnum.Material, EcopetrolEnum.Submaterial],
  stringsNotEmpty: [],
  strings: ecopetrolStringKeys,
};

export const pairsAffinityQueryKeys: QueryKeys = {
  main: PairsAffinityEnum.Pair,
  arrayNotEmpty: [],
  stringsNotEmpty: [PairsAffinityEnum.Pair],
  strings: [PairsAffinityEnum.SourceType, PairsAffinityEnum.SourceCategory],
};

export const pairsRankingQueryKeys: QueryKeys = {
  main: undefined,
  arrayNotEmpty: [],
  stringsNotEmpty: [],
  strings: [
    PairsRankingEnum.Pair,
    PairsRankingEnum.RankingOrg,
    PairsRankingEnum.RankingName,
  ],
};

export const vttNewsQueryKeys: QueryKeys = {
  main: undefined,
  arrayNotEmpty: [],
  stringsNotEmpty: [],
  strings: [
    CommonMongoKeys.Location,
    VTTEnum.Relevance,
    CommonMongoKeys.Polarity,
  ],
};

export const vttDemandsQueryKeys: QueryKeys = {
  main: VTTEnum.ClaimType,
  arrayNotEmpty: [VTTEnum.ClaimType],
  stringsNotEmpty: [],
  strings: [
    CommonMongoKeys.Location,
    VTTEnum.Relevance,
    CommonMongoKeys.Polarity,
  ],
};

export const vttDailyQueryKeys: QueryKeys = {
  main: undefined,
  arrayNotEmpty: [],
  stringsNotEmpty: [],
  strings: [],
};
