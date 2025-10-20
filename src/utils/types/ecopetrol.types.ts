import { FilterQuery } from 'mongoose';

import {
  AffinityMetricsByGroups,
  DataEntry,
  MapChartData,
} from './shared.types';
import { EcopetrolEnum } from '../enums';
import { Ecopetrol } from '../../modules/ecopetrol/ecopetrol.schema';

export type EcopetrolAffinityResponse = {
  rawData: Ecopetrol[];
  dataByGroup: Record<string, unknown>[];
  dataByDimension: EcopetrolByDimension[];
  dataInTimeByInterestGroup: DataEntry[];
  dataInTimeByDimension: DataEntry[];
  dataByCity: MapChartData[];
  fullQuery: FilterQuery<Ecopetrol>;
  count: number;
};

export type EcopetrolMaterialityResponse = {
  rawData: Ecopetrol[];
  dataByGroup: Record<string, unknown>[];
  dataInTimeByGI: DataEntry[];
  dataInTimeByMateriality: DataEntry[];
  dataByMateriality: EcopetrolByMateriality[];
  fullQuery: FilterQuery<Ecopetrol>;
  count: number;
};

export type EcopetrolByDimension = AffinityMetricsByGroups<
  EcopetrolEnum.GInterest,
  EcopetrolEnum.Dimension
>;

export type EcopetrolByMateriality = AffinityMetricsByGroups<
  EcopetrolEnum.GInterest,
  EcopetrolEnum.Material
>;
