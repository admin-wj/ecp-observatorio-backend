import { Document, FilterQuery } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  CommonMongoKeys,
  MapChartData,
  MongoCollections,
  Polarity,
  VTTEnum,
} from 'src/common';

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
  @Prop() [CommonMongoKeys.Entity]: string;
  @Prop([String]) [VTTEnum.VTTActor]: string[];
  @Prop() [VTTEnum.Title]: string;
  @Prop() [VTTEnum.Summary]: string;
  @Prop() [CommonMongoKeys.Url]: string;
  @Prop() [CommonMongoKeys.Location]: string;
  @Prop() [VTTEnum.Similarity]: string;
  @Prop([String]) [VTTEnum.ClaimType]: string[];
  @Prop([String]) [VTTEnum.ClaimActor]: string[];
  @Prop() [VTTEnum.ClaimEntity]: string;
  @Prop() [VTTEnum.ClaimMotive]: string;
  @Prop() [VTTEnum.ClaimMotiveAbb]: string;
}

export const VTTNewsSchema = SchemaFactory.createForClass(VTTNews);

export type BaseAffinitySummary = {
  affinity: {
    [Polarity.Negative]: number;
    [Polarity.Neutral]: number;
    [Polarity.Positive]: number;
  };
  total: number;
};

export type SummaryWithKeys<TKeys extends {}> = BaseAffinitySummary & TKeys;

export type ComponentSummary = SummaryWithKeys<{
  id: string;
  [VTTEnum.Component]: string;
  [VTTEnum.Subcomponent]: string[];
}>;

export type ActorSummary = SummaryWithKeys<{
  id: string;
  [VTTEnum.ClaimActor]: string[];
}>;

export type VTTNewsResponse = {
  rawData: VTTNews[];
  dataByComp: ComponentSummary[];
  fullQuery: FilterQuery<VTTNews>;
  count: number;
};

export type VTTDemandsResponse = {
  rawData: VTTNews[];
  dataByActor: ActorSummary[];
  dataByCity: MapChartData[];
  fullQuery: FilterQuery<VTTNews>;
  count: number;
};

export type VTTDailyResponse = {
  fullQuery: FilterQuery<VTTNews>;
};

type VTTStringArrayValues = Pick<
  VTTNews,
  | VTTEnum.Component
  | VTTEnum.Subcomponent
  | VTTEnum.VTTActor
  | VTTEnum.ClaimType
  | VTTEnum.ClaimActor
>;

export type VTTStringArrayKeys = keyof VTTStringArrayValues;
