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

export type TrendsHumanRightsReport = {
  risk_impact_summary: {
    analysis: {
      right: string;
      risk_level?: string;
      impact_level?: string;
      explanation: string;
      examples: {
        event: string;
        description: string;
      }[];
    }[];
  };
  geographic_summary: {
    analysis: {
      region: string;
      risk_level: string;
      impact_level: string;
      contributing_factors: string[];
      examples: {
        event: string;
        description: string;
      }[];
    }[];
  };
  critical_topics: {
    analysis: {
      right: string;
      critical_issues: {
        topic: string;
        description: string;
        risk_indicator: string;
        impact_indicator: string;
        example: string;
      }[];
    }[];
  };
  risk_impact_time_analysis: {
    risk_time_analysis: {
      human_right: string;
      risk_evolution: string;
      critical_moments: {
        highest_risk: {
          period: string;
          explanation: string;
        };
        lowest_risk: {
          period: string;
          explanation: string;
        };
      };
      key_factors: string[];
      representative_example: string;
    }[];
    impact_time_analysis: {
      human_right: string;
      impact_evolution: string;
      critical_moments: {
        highest_risk: {
          period: string;
          explanation: string;
        };
        lowest_risk: {
          period: string;
          explanation: string;
        };
      };
      key_factors: string[];
      representative_example: string;
    }[];
  };
};

export type TrendsPeaceReport = {
  peace_sector: Record<string, string[]>;
  dialogue_summary: string;
  location_summary: Record<string, string[]>;
  peace_actor_summary: Record<string, string[]>;
};
