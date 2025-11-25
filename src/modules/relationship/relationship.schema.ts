import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  CommonMongoKeys,
  MongoCollections,
  Polarity,
  RelationshipEnum,
} from 'src/utils';

export type RelationshipDocument = Relationship & Document;

@Schema({ collection: MongoCollections.Relationship })
export class Relationship {
  @Prop({ required: true }) [CommonMongoKeys.Timestamp]: Date;
  @Prop() [CommonMongoKeys.SourceType]: string;
  @Prop() [CommonMongoKeys.SourceCategory]: string;
  @Prop() [CommonMongoKeys.TextClean]: string;
  @Prop() [RelationshipEnum.Summary]: string;
  @Prop([String]) [RelationshipEnum.Keywords]: string[];
  @Prop([String]) [RelationshipEnum.InfoType]: string[];
  @Prop() [CommonMongoKeys.Entity]: string;
  @Prop() [RelationshipEnum.MentionType]: number;
  @Prop() [RelationshipEnum.EntityFoco]: string;
  @Prop() [RelationshipEnum.EntityType]: string;
  @Prop() [RelationshipEnum.GRNActor]: string;
  @Prop() [RelationshipEnum.InfluenceLevel]: string;
  @Prop([String]) [RelationshipEnum.RelPotential]: string[];
  @Prop([String]) [RelationshipEnum.RelObjective]: string[];
  @Prop() [CommonMongoKeys.Url]: string;
  @Prop() [CommonMongoKeys.Location]: string;
  @Prop() [CommonMongoKeys.LocationId]: string;
  @Prop({ enum: Polarity }) [CommonMongoKeys.Polarity]: Polarity;
  @Prop() [RelationshipEnum.PolarityNum]: number;
  @Prop([String]) [RelationshipEnum.Risk]: string[];
  @Prop() [RelationshipEnum.RiskLevel]: number;
}

export const RelationshipSchema = SchemaFactory.createForClass(Relationship);
