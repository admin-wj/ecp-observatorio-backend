import { FilterQuery } from 'mongoose';

import { MapChartData } from './shared.types';
import { Polarity, VTTEnum } from '../enums';
import { VTTNews } from '../../modules/vtt/vtt.schema';

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
