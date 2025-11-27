import { getCityData } from './commonData.functions';
import {
  CommonMongoKeys,
  TrendsGeneralEnum,
  TrendsHumanRightsEnum,
  VTTEnum,
} from '../enums';
import {
  TrendsHumanRightsByLocation,
  TrendsHumanRightsByRiskAndImpact,
} from '../types';
import {
  TrendsGeneral,
  TrendsHumanRights,
} from '../../modules/trends/trends.schema';

export const getDataByTrends = (
  data: TrendsGeneral[],
  filteredTopics: string[],
) => {
  let allTrends: string[] = Array.from(
    new Set(data.flatMap((d) => d[TrendsGeneralEnum.TrendTopic] || '')),
  );

  if (filteredTopics.length) {
    allTrends = allTrends.filter((trend) => filteredTopics.includes(trend));
  }

  return allTrends.map((trend) => {
    const dataByTrend = {
      id: trend,
      trend,
      recurrence: 0,
    };

    data.forEach((d) => {
      if (d.trend_topic?.includes(trend)) dataByTrend.recurrence += 1;
    });

    return dataByTrend;
  });
};

export const getDataByRiskAndImpcat = (
  data: TrendsHumanRights[],
  humanRights: string[],
) => {
  const formattedData = data.reduce((acc, el, i) => {
    if (i === 0)
      acc.push({
        id: 'General',
        right: 'General',
        risk: 0,
        impact: 0,
        count: 0,
      });

    el[TrendsHumanRightsEnum.HumanRight]?.forEach((hr: string, i: number) => {
      acc[0].risk += el[TrendsHumanRightsEnum.RiskIndex]
        ? el[TrendsHumanRightsEnum.RiskIndex][i]
        : 0;
      acc[0].impact += el[TrendsHumanRightsEnum.ImpactIndex]
        ? el[TrendsHumanRightsEnum.ImpactIndex][i]
        : 0;
      acc[0].count++;

      const acc_i = acc.findIndex((item) => item.right === hr);
      if (acc_i > -1) {
        acc[acc_i].risk += el[TrendsHumanRightsEnum.RiskIndex]
          ? el[TrendsHumanRightsEnum.RiskIndex][i]
          : 0;
        acc[acc_i].impact += el[TrendsHumanRightsEnum.ImpactIndex]
          ? el[TrendsHumanRightsEnum.ImpactIndex][i]
          : 0;
        acc[acc_i].count++;
      } else {
        acc.push({
          id: hr,
          right: hr,
          risk: el[TrendsHumanRightsEnum.RiskIndex]
            ? el[TrendsHumanRightsEnum.RiskIndex][i]
            : 0,
          impact: el[TrendsHumanRightsEnum.ImpactIndex]
            ? el[TrendsHumanRightsEnum.ImpactIndex][i]
            : 0,
          count: 1,
        });
      }
    });

    return acc;
  }, [] as TrendsHumanRightsByRiskAndImpact[]);

  return formattedData
    .map(({ id, right, risk, impact, count }) => ({
      id,
      right,
      risk: Number((risk / count).toFixed(2)),
      impact: Number((impact / count).toFixed(2)),
      count,
    }))
    .filter((data) =>
      humanRights.length ? humanRights.includes(data.right) : true,
    );
};

export const getDataByHumanRight = (
  data: TrendsHumanRights[],
  humanRights: string[],
  locations: string[],
) => {
  const formattedData = data.reduce((acc, el) => {
    el[TrendsHumanRightsEnum.HumanRight]?.forEach((hr: string, i: number) => {
      const acc_i = acc.findIndex((item) => item.right === hr);
      if (acc_i > -1) {
        acc[acc_i].location.push(el[CommonMongoKeys.Location]);
        if (el[VTTEnum.VTTActor] && el[VTTEnum.VTTActor][i])
          acc[acc_i].actor.push(el[VTTEnum.VTTActor][i]);
        (acc[acc_i].risk as number) += el[TrendsHumanRightsEnum.RiskIndex]
          ? el[TrendsHumanRightsEnum.RiskIndex][i]
          : 0;
        (acc[acc_i].impact as number) += el[TrendsHumanRightsEnum.ImpactIndex]
          ? el[TrendsHumanRightsEnum.ImpactIndex][i]
          : 0;
        acc[acc_i].count++;
      } else {
        acc.push({
          id: hr,
          location: [el[CommonMongoKeys.Location]],
          actor:
            el[VTTEnum.VTTActor] && el[VTTEnum.VTTActor][i]
              ? [el[VTTEnum.VTTActor][i]]
              : [],
          right: hr,
          risk: el[TrendsHumanRightsEnum.RiskIndex]
            ? el[TrendsHumanRightsEnum.RiskIndex][i]
            : 0,
          impact: el[TrendsHumanRightsEnum.ImpactIndex]
            ? el[TrendsHumanRightsEnum.ImpactIndex][i]
            : 0,
          count: 1,
        });
      }
    });

    return acc;
  }, [] as TrendsHumanRightsByLocation[]);

  return formattedData
    .map(({ id, location, actor, right, risk, impact, count }) => ({
      id,
      actor,
      location: Array.from(
        new Set(
          location.map((l) => {
            const state = getCityData(l)?.state;
            return state ?? '';
          }),
        ),
      ).filter((l) => (locations.length ? locations.includes(l) : l !== '')),
      right,
      risk: Number(((risk as number) / count).toFixed(2)),
      impact: Number(((impact as number) / count).toFixed(2)),
      count,
    }))
    .filter((data) =>
      humanRights.length ? humanRights.includes(data.right) : true,
    )
    .sort((a, b) => b.count - a.count);
};
