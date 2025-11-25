import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  CommonMongoKeys,
  MongoCollections,
  PairsAffinityEnum,
  PairsRankingEnum,
  Polarity,
} from 'src/utils';

export type PairsAffinityDocument = PairsAffinity & Document;

@Schema({ collection: MongoCollections.PairsAffinity })
export class PairsAffinity {
  @Prop({ required: true }) [CommonMongoKeys.Timestamp]: Date;
  @Prop() [CommonMongoKeys.SourceType]: string;
  @Prop() [CommonMongoKeys.SourceCategory]: string;
  @Prop() [CommonMongoKeys.Entity]: string;
  @Prop() [CommonMongoKeys.TextClean]: string;
  @Prop() [CommonMongoKeys.Url]: string;
  @Prop() [CommonMongoKeys.Location]: string;
  @Prop() [CommonMongoKeys.LocationId]: string;
  @Prop({ enum: Polarity }) [CommonMongoKeys.Polarity]: Polarity;
  @Prop() [CommonMongoKeys.Affinity]: number;
  @Prop([String]) [PairsAffinityEnum.Dimension]: string[];
  @Prop() [PairsAffinityEnum.Pair]: string;
  @Prop([String]) [PairsAffinityEnum.Keywords]: string[];
  @Prop() [CommonMongoKeys.Similarity]: number;
}

export const PairsAffinitySchema = SchemaFactory.createForClass(PairsAffinity);

export type PairsRankingDocument = PairsRanking & Document;

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

export const PairsRankingSchema = SchemaFactory.createForClass(PairsRanking);
