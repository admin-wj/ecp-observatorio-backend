import { Ecopetrol } from 'src/ecopetrol/ecopetrol.schema';
import { PairsAffinity } from 'src/pairs/pairs.schema';

import { getFormattedDate } from './dates.functions';

import { locations } from '../constants';
import { LocationDataKeys } from '../enums';
import { DataEntry, LocationInfo, MapChartData } from '../types';

export type DataWithLocation = {
  location: string;
} & Record<string, unknown>;

type AccessorData = { accessor?: LocationDataKeys; name?: string };

export const calculateGroupedMetrics = (
  data: Ecopetrol[] | PairsAffinity[],
  primaryGroupKey: keyof Ecopetrol | keyof PairsAffinity,
  secondaryGroupKey: keyof Ecopetrol | keyof PairsAffinity,
  primaryFilterValues: string[],
  secondaryFilterValues: string[],
) => {
  const groupedMetrics = new Map<string, Map<string, number>>();
  const uniquePrimaryGroups = new Set<string>();
  const uniqueSecondaryGroups = new Set<string>();

  data.forEach((item: Ecopetrol | PairsAffinity) => {
    const { affinity } = item;
    const primaryValues = item[primaryGroupKey] as string[] | null;
    let secondaryValues = item[secondaryGroupKey] as string[] | null;

    const filteredPrimaryValues = (primaryValue: string) => {
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
    };

    if (primaryValues) {
      if (Array.isArray(primaryValues)) {
        Array.from(new Set(primaryValues)).forEach((primaryValue) =>
          filteredPrimaryValues(primaryValue),
        );
      } else {
        filteredPrimaryValues(primaryValues);
      }
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
  data: Ecopetrol[] | PairsAffinity[],
  primaryGroupKey: keyof Ecopetrol | keyof PairsAffinity,
  secondaryGroupKey: keyof Ecopetrol | keyof PairsAffinity,
  primaryFilterValues: string[],
  secondaryFilterValues: string[],
  dataByGroup: Record<string, unknown>[],
) => {
  const affinityGroups = new Map<
    string,
    {
      secondaryValues: string[];
      totalCount: number;
    }
  >();

  data.forEach((item: Ecopetrol | PairsAffinity) => {
    const primaryValues = item[primaryGroupKey] as string[] | string | null;
    let secondaryValues = item[secondaryGroupKey] as string[] | null;

    const filteredPrimaryValues = (primaryValue: string) => {
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
    };

    if (primaryValues) {
      if (Array.isArray(primaryValues)) {
        primaryValues.forEach((primaryValue) =>
          filteredPrimaryValues(primaryValue),
        );
      } else {
        filteredPrimaryValues(primaryValues);
      }
    }
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
    .sort((firstItem, secondItem) => secondItem.total - firstItem.total)
    .map((v) => {
      const primaryGroupValue = dataByGroup.find(
        (d) => d.id === v[primaryGroupKey],
      );
      if (primaryGroupValue) v.affinity = primaryGroupValue.General as number;
      return v;
    });
};

export const getDataInTime = (
  data: Ecopetrol[] | PairsAffinity[],
  accessorList: string[],
  dataAccessor: keyof Ecopetrol | keyof PairsAffinity,
  mode: 'affinity' | 'count' = 'affinity',
) => {
  const allAccessors: string[] = accessorList?.length
    ? accessorList
    : Array.from(
        new Set(
          data.flatMap((d: Ecopetrol | PairsAffinity) => d[dataAccessor] ?? []),
        ),
      );

  const formattedData = data.reduce((acc, el) => {
    const date = getFormattedDate(el.timestamp);

    if (acc.length && acc[acc.length - 1].x === date) {
      allAccessors.forEach((accessor) => {
        if (
          Array.isArray(el[dataAccessor]) &&
          el[dataAccessor].includes(accessor)
        ) {
          if (mode === 'affinity') {
            acc[acc.length - 1][accessor] += el.affinity;
            acc[acc.length - 1][`${accessor}_count`] =
              (acc[acc.length - 1][`${accessor}_count`] ?? 0) + 1;
          } else if (mode === 'count') {
            acc[acc.length - 1][accessor] =
              (acc[acc.length - 1][accessor] ?? 0) + 1;
          }
        } else if (
          typeof el[dataAccessor] === 'string' &&
          el[dataAccessor] === accessor
        ) {
          if (mode === 'affinity') {
            acc[acc.length - 1][accessor] += el.affinity;
            acc[acc.length - 1][`${accessor}_count`] =
              (acc[acc.length - 1][`${accessor}_count`] ?? 0) + 1;
          } else if (mode === 'count') {
            acc[acc.length - 1][accessor] =
              (acc[acc.length - 1][accessor] ?? 0) + 1;
          }
        }
      });
    } else {
      acc.push({
        ...Object.fromEntries(allAccessors.map((key) => [key, 0])),
        ...(mode === 'affinity'
          ? Object.fromEntries(allAccessors.map((key) => [`${key}_count`, 0]))
          : {}),
      });
      acc[acc.length - 1].x = date;
      allAccessors.forEach((accessor) => {
        if (
          Array.isArray(el[dataAccessor]) &&
          el[dataAccessor].includes(accessor)
        ) {
          if (mode === 'affinity') {
            acc[acc.length - 1][accessor] = el.affinity;
            acc[acc.length - 1][`${accessor}_count`] = 1;
          } else if (mode === 'count') {
            acc[acc.length - 1][accessor] = 1;
          }
        } else if (
          typeof el[dataAccessor] === 'string' &&
          el[dataAccessor] === accessor
        ) {
          if (mode === 'affinity') {
            acc[acc.length - 1][accessor] = el.affinity;
            acc[acc.length - 1][`${accessor}_count`] = 1;
          } else if (mode === 'count') {
            acc[acc.length - 1][accessor] = 1;
          }
        }
      });
    }

    return acc;
  }, [] as DataEntry[]);

  if (mode === 'affinity') {
    return formattedData.map(
      (entry) =>
        ({
          ...Object.fromEntries(
            allAccessors.map((key) => [
              key,
              entry[`${key}_count`]
                ? Number(
                    ((entry[key] / entry[`${key}_count`]) * 100).toFixed(2),
                  )
                : 0,
            ]),
          ),
          x: entry.x,
        }) as DataEntry,
    );
  }

  return formattedData.map(
    (entry) =>
      ({
        ...Object.fromEntries(allAccessors.map((key) => [key, entry[key]])),
        x: entry.x,
      }) as DataEntry,
  );
};

export const getDataByCity = (
  data: DataWithLocation[],
  accessors: AccessorData[] = [{}],
  compareValue: 'name' | 'state' = 'name',
) =>
  data.reduce(
    (acc, el) => {
      const cityData = getCityData(el.location);
      if (cityData === null) return acc;
      const { state, coordinates } = cityData;

      if (accessors && accessors.length)
        accessors.forEach(({ accessor, name }) => {
          const currentAcc = name ? acc[name] : acc;
          const i = currentAcc.findIndex(
            (value) => value[compareValue] === cityData.state,
          );
          const value = accessor ? el[accessor] : 1;
          let valueSum = 1;

          if (typeof value === 'number') {
            valueSum = value;
          } else if (Array.isArray(value)) {
            valueSum = value.reduce((a, b) => a + b, 0);
          }

          if (i > -1) {
            currentAcc[i].value += valueSum;
            currentAcc[i].count++;
          } else {
            currentAcc.push({
              name: state,
              state,
              value: valueSum,
              count: 1,
              coordinates,
            });
          }
        });
      return acc;
    },
    accessors.length && accessors.some(({ name }) => name)
      ? accessors.reduce(
          (obj, { name }) => {
            if (name) obj[name] = [];
            return obj;
          },
          {} as Record<string, MapChartData[]>,
        )
      : ([] as MapChartData[]),
  );

export const getCityData = (location: string): LocationInfo => {
  const city = locations.find((city) => city.state === location);

  if (city) {
    return {
      name: city.name,
      state: city.state,
      coordinates: [city.latitude, city.longitude],
    };
  }

  return null;
};
