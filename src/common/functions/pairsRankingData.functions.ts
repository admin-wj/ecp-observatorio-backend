import { PairsRanking } from 'src/pairs/pairs.schema';
import { getYear } from './dates.functions';
import { CommonMongoKeys, PairsRankingEnum } from '../enums';

export const getDataByRanking = (data: PairsRanking[], pairs: string[]) => {
  const allPairs: string[] = pairs.length
    ? pairs
    : Array.from(new Set(data.map((d) => d.peer)));

  return data.reduce(
    (acc, el) => {
      const year = getYear(el[CommonMongoKeys.Timestamp]);
      const index = acc.findIndex(
        (value) =>
          value.id ===
          `${el[PairsRankingEnum.RankingOrg]}-${el[PairsRankingEnum.RankingName]}-${year}`,
      );
      if (index > -1)
        acc[index][el[PairsRankingEnum.Pair]] =
          el[PairsRankingEnum.Score100] !== undefined
            ? Number(el[PairsRankingEnum.Score100].toFixed(2))
            : null;
      else
        acc.push({
          id: `${el[PairsRankingEnum.RankingOrg]}-${el[PairsRankingEnum.RankingName]}-${year}`,
          [PairsRankingEnum.RankingOrg]: el[PairsRankingEnum.RankingOrg],
          [PairsRankingEnum.RankingName]: el[PairsRankingEnum.RankingName],
          year,
          ...Object.fromEntries(allPairs.map((key) => [key, null])),
        });

      return acc;
    },
    [] as Record<string, any>[],
  );
};
