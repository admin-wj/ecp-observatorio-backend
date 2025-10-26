import { FilterQuery } from 'mongoose';

import { MapChartData, ResponseBase, SummaryWithKeys } from './shared.types';
import { VTTEnum } from '../enums';
import { VTTNews } from '../../modules/vtt/vtt.schema';

export type ComponentSummary = SummaryWithKeys<{
  id: string;
  [VTTEnum.Component]: string;
  [VTTEnum.Subcomponent]: string[];
}>;

export type ActorSummary = SummaryWithKeys<{
  id: string;
  [VTTEnum.ClaimActor]: string[];
}>;

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

type VTTStringArrayValues = Pick<
  VTTNews,
  | VTTEnum.Component
  | VTTEnum.Subcomponent
  | VTTEnum.VTTActor
  | VTTEnum.ClaimType
  | VTTEnum.ClaimActor
>;

export type VTTStringArrayKeys = keyof VTTStringArrayValues;
