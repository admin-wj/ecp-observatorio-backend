import { Document, FilterQuery } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  AffinityMetricsByGroups,
  CommonMongoKeys,
  DataEntry,
  EcopetrolEnum,
  MapChartData,
  MongoCollections,
  Polarity,
} from 'src/common';

export type EcopetrolDocument = Ecopetrol & Document;

@Schema({ collection: MongoCollections.Ecopetrol })
export class Ecopetrol {
  @Prop({ required: true }) [CommonMongoKeys.Timestamp]: Date;
  @Prop() [EcopetrolEnum.SourceType]: string;
  @Prop() [EcopetrolEnum.SourceCategory]: string;
  @Prop() [CommonMongoKeys.Entity]: string;
  @Prop() [CommonMongoKeys.TextClean]: string;
  @Prop() [CommonMongoKeys.Url]: string;
  @Prop() [CommonMongoKeys.Location]: string;
  @Prop({ enum: Polarity }) [CommonMongoKeys.Polarity]: Polarity;
  @Prop() [CommonMongoKeys.Affinity]: number;
  @Prop([String]) [EcopetrolEnum.Dimension]: string[];
  @Prop([String]) [EcopetrolEnum.Material]: string[];
  @Prop([String]) [EcopetrolEnum.Submaterial]: string[];
  @Prop([String]) [EcopetrolEnum.GInterest]: string[];
  @Prop([String]) [EcopetrolEnum.Keywords]: string[];
  @Prop() [EcopetrolEnum.Similarity]: number;
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

export type EcopetrolByDimension = AffinityMetricsByGroups<
  EcopetrolEnum.GInterest,
  EcopetrolEnum.Dimension
>;

export type EcopetrolByMateriality = AffinityMetricsByGroups<
  EcopetrolEnum.GInterest,
  EcopetrolEnum.Material
>;
