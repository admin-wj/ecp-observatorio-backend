import { Document, FilterQuery } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  AffinityMetricsByGroups,
  CommonMongoKeys,
  DataEntry,
  MongoCollections,
  PairsAffinityEnum,
  PairsRankingEnum,
  Polarity,
} from 'src/common';

export type PairsAffinityDocument = PairsAffinity & Document;
export type PairsRankingDocument = PairsRanking & Document;

@Schema({ collection: MongoCollections.PairsAffinity })
export class PairsAffinity {
  @Prop({ required: true }) [CommonMongoKeys.Timestamp]: Date;
  @Prop() [PairsAffinityEnum.SourceType]: string;
  @Prop() [PairsAffinityEnum.SourceCategory]: string;
  @Prop() [CommonMongoKeys.Entity]: string;
  @Prop() [CommonMongoKeys.TextClean]: string;
  @Prop() [CommonMongoKeys.Url]: string;
  @Prop() [CommonMongoKeys.Location]: string;
  @Prop({ enum: Polarity }) [CommonMongoKeys.Polarity]: Polarity;
  @Prop() [CommonMongoKeys.Affinity]: number;
  @Prop([String]) [PairsAffinityEnum.Dimension]: string[];
  @Prop() [PairsAffinityEnum.Pair]: string;
  @Prop([String]) [PairsAffinityEnum.Keywords]: string[];
  @Prop() [PairsAffinityEnum.Similarity]: number;
}

@Schema({ collection: MongoCollections.PairsRanking })
export class PairsRanking {
  @Prop({ required: true }) [CommonMongoKeys.Timestamp]: Date;
  @Prop() [PairsRankingEnum.Pair]: string;
  @Prop() [PairsRankingEnum.RankingOrg]: string;
  @Prop() [PairsRankingEnum.RankingName]: string;
  @Prop() [PairsRankingEnum.ScoreRaw]: string;
  @Prop() [PairsRankingEnum.Score100]: number;
  @Prop() [PairsRankingEnum.Rank]: number;
  @Prop() [CommonMongoKeys.TextClean]: string;
  @Prop() [CommonMongoKeys.Url]: string;
}

export const PairsAffinitySchema = SchemaFactory.createForClass(PairsAffinity);
export const PairsRankingSchema = SchemaFactory.createForClass(PairsRanking);

export type PairsAffinityResponse = {
  rawData: PairsAffinity[];
  dataByPairsAndDimension: Record<string, unknown>[];
  dataInTimeByAffinity: DataEntry[];
  dataInTimeByTexts: DataEntry[];
  dataByPairs: PairsAffinityByPairs[];
  fullQuery: FilterQuery<PairsAffinity>;
  count: number;
};

export type PairsAffinityByPairs = AffinityMetricsByGroups<
  PairsAffinityEnum.Pair,
  PairsAffinityEnum.Dimension
>;

export type PairsRankingResponse = {
  rawData: PairsRanking[];
  dataByRanking: Record<string, unknown>[];
  fullQuery: FilterQuery<PairsRanking>;
  count: number;
};
