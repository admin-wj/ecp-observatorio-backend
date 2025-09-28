import { locations } from '../constants';
import { LocationDataKeys } from '../enums';
import { LocationInfo, MapChartData } from '../types';

type DataWithLocation = {
  location: string;
} & Record<LocationDataKeys, number | number[]>;

type AccessorData = { accessor?: LocationDataKeys; name?: string };

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
