import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  CommonMongoKeys,
  EcopetrolEnum,
  MongoCollections,
  Polarity,
} from 'src/utils';

export type EcopetrolDocument = Ecopetrol & Document;

@Schema({ collection: MongoCollections.Ecopetrol })
export class Ecopetrol {
  @Prop({ required: true }) [CommonMongoKeys.Timestamp]: Date;
  @Prop() [CommonMongoKeys.SourceType]: string;
  @Prop() [CommonMongoKeys.SourceCategory]: string;
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
  @Prop() [CommonMongoKeys.Similarity]: number;
}

export const EcopetrolSchema = SchemaFactory.createForClass(Ecopetrol);
