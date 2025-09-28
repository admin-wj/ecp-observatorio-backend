import * as dayjs from 'dayjs';
import {
  Ecopetrol,
  EcopetrolByMateriality,
} from 'src/ecopetrol/ecopetrol.schema';
import { DataEntry } from '../types';

export const calculateGroupedMetrics = (
  data: Ecopetrol[],
  primaryGroupKey: keyof Ecopetrol,
  secondaryGroupKey: keyof Ecopetrol,
  primaryFilterValues: string[],
  secondaryFilterValues: string[],
) => {
  const groupedMetrics = new Map<string, Map<string, number>>();
  const uniquePrimaryGroups = new Set<string>();
  const uniqueSecondaryGroups = new Set<string>();

  data.forEach((item) => {
    const { affinity } = item;
    const primaryValues = item[primaryGroupKey] as string[] | null;
    let secondaryValues = item[secondaryGroupKey] as string[] | null;

    if (primaryValues) {
      Array.from(new Set(primaryValues)).forEach((primaryValue) => {
        uniquePrimaryGroups.add(primaryValue);
        secondaryValues = Array.from(new Set(secondaryValues));
        secondaryValues.forEach((secondaryValue) => {
          uniqueSecondaryGroups.add(secondaryValue);
          uniqueSecondaryGroups.add(`${secondaryValue}_TOTAL`);

          if (!groupedMetrics.has(primaryValue)) {
            groupedMetrics.set(primaryValue, new Map());
          }

          const groupMetrics = groupedMetrics.get(primaryValue)!;
          groupMetrics.set(
            secondaryValue,
            (groupMetrics.get(secondaryValue) || 0) + affinity,
          );
          groupMetrics.set(
            `${secondaryValue}_TOTAL`,
            (groupMetrics.get(`${secondaryValue}_TOTAL`) || 0) + 1,
          );
        });
      });
    }
  });

  const overallMetrics = new Map<string, number>();
  groupedMetrics.forEach((groupMetrics) => {
    groupMetrics.forEach((value, secondaryValue) => {
      overallMetrics.set(
        secondaryValue,
        (overallMetrics.get(secondaryValue) || 0) + value,
      );
    });
  });

  groupedMetrics.set('General', overallMetrics);
  const resultData = ['General', ...Array.from(uniquePrimaryGroups)].map(
    (id) => {
      const rowData: Record<string, unknown> = { id };
      const secondaryMetrics = groupedMetrics.get(id) || new Map();

      let secondarySum = 0;
      let secondaryTotalSum = 0;
      Array.from(uniqueSecondaryGroups).forEach((secondaryValue) => {
        const value = secondaryMetrics.get(secondaryValue) || 0;
        rowData[secondaryValue] = value;
        if (secondaryValue.includes('_T')) secondaryTotalSum += value;
        else secondarySum += value;
      });

      rowData['General'] = secondarySum;
      rowData['General_T'] = secondaryTotalSum;
      return rowData;
    },
  );

  return resultData
    .map((row: Record<string, number>) => {
      return Object.keys(row).reduce((acc: Record<string, unknown>, key) => {
        if (key === 'id') acc[key] = row[key];
        if (key.includes('_T')) {
          const metricKey = key.split('_T')[0];

          if (secondaryFilterValues.length) {
            if (
              secondaryFilterValues.includes(metricKey) ||
              metricKey === 'General'
            )
              acc[metricKey] = Number((row[metricKey] / row[key]).toFixed(2));
          } else
            acc[metricKey] = Number((row[metricKey] / row[key]).toFixed(2));
        }
        return acc;
      }, {});
    })
    .filter((row) =>
      primaryFilterValues.length
        ? primaryFilterValues.includes(row.id as string)
        : true,
    );
};

export const calculateAffinityMetricsByGroups = (
  ecopetrolData: Ecopetrol[],
  primaryGroupKey: keyof Ecopetrol,
  secondaryGroupKey: keyof Ecopetrol,
  primaryFilterValues: string[],
  secondaryFilterValues: string[],
) => {
  const affinityGroups = new Map<
    string,
    {
      secondaryValues: string[];
      totalCount: number;
    }
  >();

  ecopetrolData.forEach((item) => {
    const primaryValues = item[primaryGroupKey] as string[] | null;
    let secondaryValues = item[secondaryGroupKey] as string[] | null;

    primaryValues?.forEach((primaryValue) => {
      if (primaryValue && !affinityGroups.has(primaryValue)) {
        if (primaryFilterValues.length) {
          if (primaryFilterValues.includes(primaryValue)) {
            affinityGroups.set(primaryValue, {
              secondaryValues: [],
              totalCount: 0,
            });
          }
        } else {
          affinityGroups.set(primaryValue, {
            secondaryValues: [],
            totalCount: 0,
          });
        }
      }

      const groupData = affinityGroups.get(primaryValue ?? '');

      if (groupData) {
        secondaryValues?.forEach((secondaryValue) => {
          if (!groupData.secondaryValues.includes(secondaryValue)) {
            groupData.secondaryValues.push(secondaryValue);
          }
        });

        groupData.totalCount++;
      }
    });
  });

  return Array.from(affinityGroups.entries())
    .map(([primaryValue, { secondaryValues, totalCount }], index) => {
      if (secondaryFilterValues.length && secondaryValues) {
        secondaryValues = secondaryValues.filter((value) =>
          secondaryFilterValues.includes(value),
        );
      }
      return {
        id: index.toString(),
        [primaryGroupKey]: primaryValue,
        [secondaryGroupKey]: secondaryValues,
        affinity: 0,
        summary: '',
        total: totalCount,
      };
    })
    .sort((firstItem, secondItem) => secondItem.total - firstItem.total);
};

export const getDataInTime = (
  data: Ecopetrol[],
  accessorList: string[],
  dataAccessor: keyof Pick<Ecopetrol, 'dimension' | 'g_interest' | 'material'>,
) => {
  const allAccessors: string[] = accessorList.length
    ? accessorList
    : Array.from(new Set(data.flatMap((d) => d[dataAccessor] ?? [])));

  const formattedData = data.reduce((acc, el) => {
    const date = dayjs(el.timestamp).format('DD/MM/YYYY');

    if (acc.length && acc[acc.length - 1].x === date)
      allAccessors.forEach((accessor) => {
        if (el[dataAccessor] && el[dataAccessor].includes(accessor)) {
          acc[acc.length - 1][accessor] += el.affinity;
          acc[acc.length - 1][`${accessor}_count`]++;
        }
      });
    else {
      acc.push({
        ...Object.fromEntries(allAccessors.map((key) => [key, 0])),
        ...Object.fromEntries(allAccessors.map((key) => [`${key}_count`, 0])),
      });
      acc[acc.length - 1].x = date;
      allAccessors.forEach((accessor) => {
        if (el[dataAccessor] && el[dataAccessor].includes(accessor)) {
          acc[acc.length - 1][accessor] = el.affinity;
          acc[acc.length - 1][`${accessor}_count`] = 1;
        }
      });
    }

    return acc;
  }, [] as DataEntry[]);

  return formattedData.map(
    (entry) =>
      ({
        ...Object.fromEntries(
          Array.from(allAccessors).map((key) => [
            key,
            entry[`${key}_count`]
              ? Number(((entry[key] / entry[`${key}_count`]) * 100).toFixed(2))
              : 0,
          ]),
        ),
        x: entry.x,
      }) as DataEntry,
  );
};

export const getDataByMateriality = (
  data: Ecopetrol[],
  meteriality: string[],
  interestGroups: string[],
  dataByGroup: Record<string, unknown>[],
): EcopetrolByMateriality[] => {
  const groupedData = new Map<
    string,
    { materials: string[]; affinity: number; total: number }
  >();

  data.forEach(({ g_interest, material, affinity }) => {
    g_interest &&
      g_interest.length &&
      g_interest.forEach((gi) => {
        if (gi && !groupedData.has(gi)) {
          if (interestGroups.length) {
            if (interestGroups.includes(gi))
              groupedData.set(gi, { materials: [], affinity: 0, total: 0 });
          } else groupedData.set(gi, { materials: [], affinity: 0, total: 0 });
        }

        const group = groupedData.get(gi ?? '')!;

        if (group) {
          material &&
            material.forEach((mat) => {
              if (!group?.materials.includes(mat)) group.materials.push(mat);
            });

          group.affinity += affinity;
          group.total++;
        }
      });
  });

  return Array.from(groupedData.entries())
    .map(([g_interest, { materials, affinity, total }], i) => {
      if (meteriality.length && materials)
        materials = materials.filter((m) => meteriality.includes(m));
      return {
        id: i.toString(),
        g_interest,
        materials,
        affinity: Number((affinity / total).toFixed(2)),
        summary: '',
        total,
      };
    })
    .sort((a, b) => b.total - a.total)
    .map((v) => {
      const g_interest = dataByGroup.find((d) => d.id === v.g_interest);
      if (g_interest) v.affinity = g_interest.General as number;

      return v;
    });
};
