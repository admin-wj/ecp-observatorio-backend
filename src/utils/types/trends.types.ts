import {
  DataEntry,
  KeyValueCount,
  MapChartData,
  ResponseBase,
  WithCount,
} from './shared.types';
import {
  TrendsGeneral,
  TrendsHumanRights,
  TrendsPeace,
} from '../../modules/trends/trends.schema';

export type TrendsGeneralByTrend = {
  trend: string;
  recurrence: number;
};

export type TrendsHumanRightsByRiskAndImpact = WithCount<{
  id: string;
  right: string;
  risk: number;
  impact: number;
}>;

export type TrendsHumanRightsByLocation = TrendsHumanRightsByRiskAndImpact & {
  location: string[];
  actor: string[];
};

export type TrendsHumanRightsByCity = {
  risk: MapChartData[];
  impact: MapChartData[];
};

export type TrendsPeaceByCorp = KeyValueCount<{
  corp: string;
}>;

export type TrendsPeaceByConversation = KeyValueCount<{
  conversation: string;
}>;

export type TrendsGeneralResponse = ResponseBase<
  TrendsGeneral,
  {
    dataByTrends: TrendsGeneralByTrend[];
    dataInTimeByRecurrence: DataEntry[];
  }
>;

export type TrendsHumanRightsResponse = ResponseBase<
  TrendsHumanRights,
  {
    dataByRiskAndImpact: TrendsHumanRightsByRiskAndImpact[];
    dataByCity: TrendsHumanRightsByCity;
    dataByHumanRight: TrendsHumanRightsByLocation[];
    dataInTimeByImpact: DataEntry[];
    dataInTimeByRisk: DataEntry[];
  }
>;

export type TrendsPeaceResponse = ResponseBase<
  TrendsPeace,
  {
    dataByConversationAndActor: Record<string, unknown>[];
    dataByCorp: TrendsPeaceByCorp[];
    dataByConversation: TrendsPeaceByConversation[];
    dataByCity: MapChartData[];
  }
>;
