import {
  AffinityMetricsByGroups,
  DataEntry,
  MapChartData,
  ResponseBase,
} from './shared.types';
import { EcopetrolEnum } from '../enums';
import { Ecopetrol } from '../../modules/ecopetrol/ecopetrol.schema';

export type EcopetrolByDimension = AffinityMetricsByGroups<
  EcopetrolEnum.GInterest,
  EcopetrolEnum.Dimension
>;

export type EcopetrolByMateriality = AffinityMetricsByGroups<
  EcopetrolEnum.GInterest,
  EcopetrolEnum.Material
>;

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

export type EcopetrolAffinityReport = {
  dimension_summary: string;
  ginterest_dimension: Record<string, string[]>;
  time_analysis: Record<string, string[]>;
  geographic: string;
};

export type EcopetrolMaterialityReport = {
  material_summary: string;
  ginterest_material: Record<string, string[]>;
  time_analysis: Record<string, string[]>;
};
