import {
  AffinityMetricsByGroups,
  DataEntry,
  MapChartData,
  ResponseBase,
} from './shared.types';
import { EcopetrolEnum } from '../enums';
import { Ecopetrol } from '../../modules/ecopetrol/ecopetrol.schema';

export type EcopetrolAffinityResponse = ResponseBase<
  Ecopetrol,
  {
    dataByGroup: Record<string, unknown>[];
    dataByDimension: EcopetrolByDimension[];
    dataInTimeByInterestGroup: DataEntry[];
    dataInTimeByDimension: DataEntry[];
    dataByCity: MapChartData[];
  }
>;

export type EcopetrolMaterialityResponse = ResponseBase<
  Ecopetrol,
  {
    dataByGroup: Record<string, unknown>[];
    dataInTimeByGI: DataEntry[];
    dataInTimeByMateriality: DataEntry[];
    dataByMateriality: EcopetrolByMateriality[];
  }
>;

export type EcopetrolByDimension = AffinityMetricsByGroups<
  EcopetrolEnum.GInterest,
  EcopetrolEnum.Dimension
>;

export type EcopetrolByMateriality = AffinityMetricsByGroups<
  EcopetrolEnum.GInterest,
  EcopetrolEnum.Material
>;
