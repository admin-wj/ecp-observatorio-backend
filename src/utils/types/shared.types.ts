import { FilterQuery } from 'mongoose';

import { LocationDataKeys, Polarity, Relevance } from '../enums';

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

export type FiltersValues = {
  startDate?: Date;
  endDate?: Date;
} & Record<Exclude<string, 'startDate' | 'endDate'>, string[]>;

export type WithCount<T> = T & {
  count: number;
};

export type ResponseBase<T, K> = WithCount<{
  rawData: T[];
  fullQuery: FilterQuery<T>;
}> &
  K;

export type DateRange = {
  startDate?: string;
  endDate?: string;
};

export type DataEntry = {
  x?: string;
} & Record<Exclude<string, 'x'>, number>;

export type DataWithLocation<T> = {
  location: string;
} & T;

export type AccessorData = { accessor?: LocationDataKeys; name?: string };

export type MapChartData = WithCount<{
  name: string;
  state?: string;
  value: number;
  coordinates: number[];
}>;

export type LocationInfo = {
  name: string;
  state: string;
  coordinates: number[];
} | null;

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

export type BaseRelevanceSummary = WithCount<{
  relevance: {
    [Relevance.Low]: number;
    [Relevance.Medium]: number;
    [Relevance.High]: number;
  };
  similarity_vtt: number;
}>;

export type SummaryWithKeys<TKeys extends {}> = BaseRelevanceSummary & TKeys;

export type KeyValueCount<TKeys extends {}> = WithCount<{
  id: string;
}> &
  TKeys;
