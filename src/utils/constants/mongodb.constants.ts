import {
  CommonMongoKeys,
  EcopetrolEnum,
  PairsAffinityEnum,
  PairsRankingEnum,
  TrendsHumanRightsEnum,
  VTTEnum,
} from '../enums';
import { QueryKeys } from '../types';

export const defaultParamsKeys = ['startDate', 'endDate', 'needsPastData'];

export const commonStringKeys = [
  CommonMongoKeys.SourceType,
  CommonMongoKeys.SourceCategory,
];

export const ecopetrolStringKeys = [
  ...commonStringKeys,
  CommonMongoKeys.Location,
];

export const trendsStringKeys = [...commonStringKeys, CommonMongoKeys.Entity];

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
  strings: commonStringKeys,
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

export const trendsGeneralQueryKeys: QueryKeys = {
  main: undefined,
  arrayNotEmpty: [],
  stringsNotEmpty: [],
  strings: trendsStringKeys,
};

export const trendsHumanRightsQueryKeys: QueryKeys = {
  main: TrendsHumanRightsEnum.HumanRight,
  arrayNotEmpty: [TrendsHumanRightsEnum.HumanRight],
  stringsNotEmpty: [],
  strings: trendsStringKeys,
};

export const trendsPeaceQueryKeys: QueryKeys = {
  main: undefined,
  arrayNotEmpty: [],
  stringsNotEmpty: [],
  strings: [],
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
