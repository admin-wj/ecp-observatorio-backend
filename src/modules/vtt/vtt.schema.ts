import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  CommonMongoKeys,
  MongoCollections,
  Polarity,
  VTTEnum,
} from 'src/utils';

export type VTTNewsDocument = VTTNews & Document;

@Schema({ collection: MongoCollections.VTTNews })
export class VTTNews {
  @Prop({ required: true }) [CommonMongoKeys.Timestamp]: Date;
  @Prop() [CommonMongoKeys.TextClean]: string;
  @Prop([String]) [VTTEnum.Component]: string[];
  @Prop([String]) [VTTEnum.Subcomponent]: string[];
  @Prop() [VTTEnum.InfoType]: string;
  @Prop({ enum: Polarity }) [CommonMongoKeys.Polarity]: Polarity;
  @Prop() [CommonMongoKeys.Affinity]: number;
  @Prop() [VTTEnum.Relevance]: string;
  @Prop() [VTTEnum.SimilarityVTT]: number;
  @Prop() [CommonMongoKeys.Entity]: string;
  @Prop([String]) [VTTEnum.VTTActor]: string[];
  @Prop() [VTTEnum.Title]: string;
  @Prop() [VTTEnum.Summary]: string;
  @Prop() [CommonMongoKeys.Url]: string;
  @Prop() [CommonMongoKeys.Location]: string;
  @Prop() [CommonMongoKeys.LocationId]: string;
  @Prop() [CommonMongoKeys.Similarity]: number;
  @Prop([String]) [VTTEnum.ClaimType]: string[];
  @Prop([String]) [VTTEnum.ClaimActor]: string[];
  @Prop() [VTTEnum.ClaimEntity]: string;
  @Prop() [VTTEnum.ClaimMotive]: string;
  @Prop() [VTTEnum.ClaimMotiveAbb]: string;
}

export const VTTNewsSchema = SchemaFactory.createForClass(VTTNews);
