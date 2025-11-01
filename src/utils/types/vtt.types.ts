import { FilterQuery } from 'mongoose';

import { MapChartData, ResponseBase, SummaryWithKeys } from './shared.types';
import { VTTEnum } from '../enums';
import { VTTNews } from '../../modules/vtt/vtt.schema';

export type ComponentSummary = SummaryWithKeys<{
  id: string;
  [VTTEnum.Component]: string;
  [VTTEnum.Subcomponent]: string[];
  [VTTEnum.SimilarityVTT]: number;
}>;

export type ActorSummary = SummaryWithKeys<{
  id: string;
  [VTTEnum.ClaimActor]: string;
  [VTTEnum.SimilarityVTT]: number;
}>;

type VTTStringArrayValues = Pick<
  VTTNews,
  | VTTEnum.Component
  | VTTEnum.Subcomponent
  | VTTEnum.VTTActor
  | VTTEnum.ClaimType
  | VTTEnum.ClaimActor
>;

export type VTTStringArrayKeys = keyof VTTStringArrayValues;

export type VTTNewsResponse = ResponseBase<
  VTTNews,
  {
    dataByComp: ComponentSummary[];
  }
>;

export type VTTDemandsResponse = ResponseBase<
  VTTNews,
  {
    dataByActor: ActorSummary[];
    dataByCity: MapChartData[];
  }
>;

export type VTTDailyResponse = {
  fullQuery: FilterQuery<VTTNews>;
};

export type VTTNewsReport = {
  components: Record<
    string,
    {
      summary: string[];
      keywords: string[];
    }
  >;
};

export type VTTDemandsReport = {
  location: Record<string, string[]>;
  claim_actor: Record<
    string,
    {
      summary: string[];
      keywords: string[];
    }
  >;
};

export type VTTDailyReport = {
  daily_news: {
    title: string;
    entity: string;
    url: string;
    ideas: string[];
    ecp_topics: string[];
  }[];
};
