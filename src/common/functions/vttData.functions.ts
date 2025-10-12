import {
  ActorSummary,
  ComponentSummary,
  SummaryWithKeys,
  VTTNews,
  VTTStringArrayKeys,
} from 'src/vtt/vtt.schema';
import { Polarity } from '../enums';

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
    const { polarity } = d;
    const primaryData: string[] = d[primaryKey];
    let secondaryData: string[] = secondaryKey ? d[secondaryKey] : [];

    if (secondaryFilters?.length)
      secondaryData = secondaryData.filter((sD) => secondaryFiltersSet.has(sD));

    if (!primaryData?.length) return;

    primaryData.forEach((pD) => {
      if (!pD || (primaryFilters.length && !primaryFiltersSet.has(pD))) return;
      if (!groupedData.has(pD)) {
        const base = {
          affinity: {
            [Polarity.Negative]: 0,
            [Polarity.Neutral]: 0,
            [Polarity.Positive]: 0,
          },
          total: 0,
          ...(secondaryKey ? { [secondaryKey as string]: [] as string[] } : {}),
        } as SummaryWithKeys<
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
        group.affinity[polarity]++;
        group.total++;
      }
    });
  });

  return Array.from(groupedData.entries())
    .map(([primaryData, mapData], i) => {
      const { affinity, total } = mapData;
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
        affinity,
        total,
      };
    })
    .sort((a, b) => b.total - a.total) as ComponentSummary[] | ActorSummary[];
};
