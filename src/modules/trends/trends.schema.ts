import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  CommonMongoKeys,
  MongoCollections,
  Polarity,
  TrendsGeneralEnum,
  TrendsHumanRightsEnum,
  TrendsPeaceEnum,
  VTTEnum,
} from 'src/utils';

// Trends General
export type TrendsGeneralDocument = TrendsGeneral & Document;

@Schema({ collection: MongoCollections.TrendsGeneral })
export class TrendsGeneral {
  @Prop({ required: true }) [CommonMongoKeys.Timestamp]: Date;
  @Prop() [CommonMongoKeys.SourceType]: string;
  @Prop() [CommonMongoKeys.SourceCategory]: string;
  @Prop() [CommonMongoKeys.Entity]: string;
  @Prop() [CommonMongoKeys.TextClean]: string;
  @Prop() [CommonMongoKeys.Url]: string;
  @Prop() [CommonMongoKeys.Location]: string;
  @Prop([String]) [TrendsGeneralEnum.Topic]: string[];
  @Prop([String]) [TrendsGeneralEnum.TrendTopic]: string[];
  @Prop() [TrendsGeneralEnum.TrendIndex]: number;
}

export const TrendsGeneralSchema = SchemaFactory.createForClass(TrendsGeneral);

// Trends Human Rights
export type TrendsHumanRightsDocument = TrendsHumanRights & Document;

@Schema({ collection: MongoCollections.TrendsHumanRights })
export class TrendsHumanRights {
  @Prop({ required: true }) [CommonMongoKeys.Timestamp]: Date;
  @Prop() [CommonMongoKeys.SourceType]: string;
  @Prop() [CommonMongoKeys.SourceCategory]: string;
  @Prop() [CommonMongoKeys.Entity]: string;
  @Prop() [CommonMongoKeys.TextClean]: string;
  @Prop() [CommonMongoKeys.Url]: string;
  @Prop() [TrendsHumanRightsEnum.Title]: string;
  @Prop() [CommonMongoKeys.Similarity]: number;
  @Prop() [CommonMongoKeys.Location]: string;
  @Prop({ enum: Polarity }) [CommonMongoKeys.Polarity]: Polarity;
  @Prop() [CommonMongoKeys.Affinity]: number;
  @Prop([String]) [TrendsHumanRightsEnum.MentionEntity]: string[];
  @Prop([String]) [TrendsHumanRightsEnum.HumanRight]: string[];
  @Prop([String]) [VTTEnum.VTTActor]: string[];
  @Prop([Number]) [TrendsHumanRightsEnum.RiskIndex]: number[];
  @Prop([Number]) [TrendsHumanRightsEnum.ImpactIndex]: number[];
  @Prop() [TrendsHumanRightsEnum.SimilarityHR]: number;
}

export const TrendsHumanRightsSchema =
  SchemaFactory.createForClass(TrendsHumanRights);

// Trends Peace
export type TrendsPeaceDocument = TrendsPeace & Document;

@Schema({ collection: MongoCollections.TrendsPeace })
export class TrendsPeace {
  @Prop({ required: true }) [CommonMongoKeys.Timestamp]: Date;
  @Prop() [CommonMongoKeys.SourceType]: string;
  @Prop() [CommonMongoKeys.SourceCategory]: string;
  @Prop() [CommonMongoKeys.Entity]: string;
  @Prop() [CommonMongoKeys.TextClean]: string;
  @Prop() [CommonMongoKeys.Url]: string;
  @Prop() [TrendsPeaceEnum.Title]: string;
  @Prop() [CommonMongoKeys.Similarity]: number;
  @Prop() [CommonMongoKeys.Location]: string;
  @Prop({ enum: Polarity }) [CommonMongoKeys.Polarity]: Polarity;
  @Prop() [CommonMongoKeys.Affinity]: number;
  @Prop([String]) [TrendsPeaceEnum.MentionEntity]: string[];
  @Prop([String]) [TrendsPeaceEnum.PeaceConv]: string[];
  @Prop([String]) [TrendsPeaceEnum.Corps]: string[];
  @Prop([String]) [TrendsPeaceEnum.PeaceActor]: string[];
  @Prop() [TrendsPeaceEnum.PeaceAgree]: string;
}

export const TrendsPeaceSchema = SchemaFactory.createForClass(TrendsPeace);
