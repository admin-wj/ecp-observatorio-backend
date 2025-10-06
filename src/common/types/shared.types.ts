import { LocationDataKeys } from "../enums";

export type QueryParams = Record<string, string | string[] | undefined>;

export type QueryKeys = {
  main: string | undefined;
  arrayNotEmpty: string[];
  stringsNotEmpty: string[];
  strings: string[];
};

export type Filters = {
  dates?: DateRange;
  needsPastData: boolean;
  extraFilters: Record<string, string[]>;
};

export type DateRange = {
  startDate?: string;
  endDate?: string;
};

export type AffinityMetricsByGroups<
  T extends string = never,
  K extends string = never,
> = {
  id: string;
  affinity: number;
  summary: string;
  total: number;
} & {
  [key in T]: string;
} & {
  [key in K]: string[];
};

export type DataEntry = {
  x?: string;
} & Record<Exclude<string, 'x'>, number>;

export type DataWithLocation<T> = {
  location: string;
} & T;

export type AccessorData = { accessor?: LocationDataKeys; name?: string };

export type MapChartData = {
  name: string;
  state?: string;
  value: number;
  count: number;
  coordinates: number[];
};

export type LocationInfo = {
  name: string;
  state: string;
  coordinates: number[];
} | null;
