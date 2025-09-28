import { Document, FilterQuery } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { DataEntry, MapChartData, Polarity } from 'src/common';

export type EcopetrolDocument = Ecopetrol & Document;

@Schema({ collection: 'df_ecp' })
export class Ecopetrol {
  @Prop({ required: true }) timestamp: Date;
  @Prop() source_type: string;
  @Prop() source_category: string;
  @Prop() entity: string;
  @Prop() text_clean: string;
  @Prop() url: string;
  @Prop() location: string;
  @Prop({ enum: Polarity }) polarity: Polarity;
  @Prop() affinity: number;
  @Prop([String]) dimension: string[];
  @Prop([String]) material: string[];
  @Prop([String]) submaterial: string[];
  @Prop([String]) g_interest: string[];
  @Prop([String]) keywords: string[];
  @Prop() similarity: number;
}

export const EcopetrolSchema = SchemaFactory.createForClass(Ecopetrol);

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

export type EcopetrolByDimension = {
  id: string;
  g_interest: string;
  dimensions: string[];
  affinity: number;
  summary: string;
  total: number;
};

export type EcopetrolByMateriality = {
  id: string;
  g_interest: string;
  materials: string[];
  affinity: number;
  summary: string;
  total: number;
};
