export type QueryParams = Record<string, string | string[] | undefined>;

export type Filters = {
  dates?: DateRange;
  needsPastData: boolean;
  extraFilters: Record<string, string[]>;
};

export type DateRange = {
  startDate?: string;
  endDate?: string;
};

export type DataEntry = {
  x?: string;
} & Record<Exclude<string, 'x'>, number>;

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
