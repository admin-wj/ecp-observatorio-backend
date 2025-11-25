import { VTTNews } from 'src/modules/vtt/vtt.schema';

import { Relevance, VTTEnum } from '../enums';
import {
  ActorSummary,
  ComponentSummary,
  SummaryWithKeys,
  VTTStringArrayKeys,
} from '../types';

export const getVTTGroupedData = <
  TPrimary extends VTTStringArrayKeys,
  TSecondary extends VTTStringArrayKeys | undefined,
>(
  data: VTTNews[],
  primaryFilters: string[],
  primaryKey: TPrimary,
  secondaryFilters?: string[],
  secondaryKey?: TSecondary,
): ComponentSummary[] | ActorSummary[] => {
  const groupedData = new Map<
    string,
    SummaryWithKeys<
      TSecondary extends VTTStringArrayKeys
        ? { [K in TSecondary]: string[] }
        : {}
    >
  >();

  const primaryFiltersSet = new Set(primaryFilters);
  const secondaryFiltersSet = new Set(secondaryFilters);

  data.forEach((d) => {
    const { relevance } = d;
    const primaryData: string[] = d[primaryKey];
    let secondaryData: string[] = secondaryKey ? d[secondaryKey] : [];

    if (secondaryFilters?.length)
      secondaryData = secondaryData.filter((sD) => secondaryFiltersSet.has(sD));

    if (!primaryData?.length) return;

    primaryData.forEach((pD) => {
      if (!pD || (primaryFilters.length && !primaryFiltersSet.has(pD))) return;
      if (!groupedData.has(pD)) {
        const base = {
          relevance: {
            [Relevance.Low]: 0,
            [Relevance.Medium]: 0,
            [Relevance.High]: 0,
          },
          similarity_vtt: d[VTTEnum.SimilarityVTT],
          count: 0,
          ...(secondaryKey ? { [secondaryKey as string]: [] as string[] } : {}),
        } as unknown as SummaryWithKeys<
          TSecondary extends VTTStringArrayKeys
            ? { [K in TSecondary]: string[] }
            : {}
        >;
        groupedData.set(pD, base);
      }

      const group = groupedData.get(pD);

      if (group && secondaryKey) {
        if (secondaryData && secondaryData.length) {
          group[secondaryKey as VTTStringArrayKeys].push(
            ...Array.from(new Set(secondaryData)),
          );
        }
      }

      if (group) {
        group.relevance[relevance]++;
        group.similarity_vtt += d[VTTEnum.SimilarityVTT];
        group.count++;
      }
    });
  });

  return Array.from(groupedData.entries())
    .map(([primaryData, mapData], i) => {
      const { relevance, similarity_vtt, count } = mapData;
      return {
        id: i.toString(),
        [primaryKey]: primaryData,
        ...(secondaryKey
          ? {
              [secondaryKey]:
                Array.from(
                  new Set(mapData[secondaryKey as VTTStringArrayKeys]),
                ) || [],
            }
          : {}),
        relevance,
        similarity_vtt: Number((similarity_vtt / count).toFixed(0)),
        count,
      };
    })
    .sort((a, b) => b.count - a.count) as ComponentSummary[] | ActorSummary[];
};
