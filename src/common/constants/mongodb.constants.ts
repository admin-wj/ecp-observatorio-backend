import {
  CommonMongoKeys,
  EcopetrolEnum,
  PairsAffinityEnum,
  PairsRankingEnum,
} from '../enums';

export const defaultParamsKeys = ['startDate', 'endDate', 'needsPastData'];

export const ecopetrolStringKeys = [
  CommonMongoKeys.Location,
  EcopetrolEnum.SourceType,
  EcopetrolEnum.SourceCategory,
];

export const ecopetrolAffinityQueryKeys = {
  main: EcopetrolEnum.Dimension,
  arrayNotEmpty: [EcopetrolEnum.Dimension],
  stringsNotEmpty: [],
  strings: ecopetrolStringKeys,
};

export const ecopetrolMaterialityQueryKeys = {
  main: EcopetrolEnum.Material,
  arrayNotEmpty: [EcopetrolEnum.Material, EcopetrolEnum.Submaterial],
  stringsNotEmpty: [],
  strings: ecopetrolStringKeys,
};

export const pairsAffinityQueryKeys = {
  main: PairsAffinityEnum.Pair,
  arrayNotEmpty: [],
  stringsNotEmpty: [PairsAffinityEnum.Pair],
  strings: [PairsAffinityEnum.SourceType, PairsAffinityEnum.SourceCategory],
};

export const pairsRankingQueryKeys = {
  main: undefined,
  arrayNotEmpty: [],
  stringsNotEmpty: [],
  strings: [
    PairsRankingEnum.Pair,
    PairsRankingEnum.RankingOrg,
    PairsRankingEnum.RankingName,
  ],
};
