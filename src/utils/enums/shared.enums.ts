import { TrendsHumanRightsEnum } from './trends.enums';

export enum MainPathEndpoint {
  Auth = 'auth',
  Ecopetrol = 'ecopetrol',
  Pairs = 'pairs',
  Trends = 'trends',
  VTT = 'vtt',
  RAG = 'rag',
  Relationship = 'relationship'
}

export enum SubPathEndpoint {
  Get_Token = 'get-token',
  Affinity = 'affinity',
  Materiality = 'materiality',
  Ranking = 'ranking',
  General = 'general',
  Human_Rights = 'human-rights',
  Peace = 'peace',
  News = 'news',
  Demands = 'demands',
  Daily = 'daily',
  Summary = 'summary',
  Report = 'report',
  SendReport = 'send-report',
}

export enum RAGEndpoints {
  Ecopetrol_Affinity = `${MainPathEndpoint.Ecopetrol}-${SubPathEndpoint.Affinity}`,
  Ecopetrol_Materiality = `${MainPathEndpoint.Ecopetrol}-${SubPathEndpoint.Materiality}`,
  Pairs_Affinity = `${MainPathEndpoint.Pairs}-${SubPathEndpoint.Affinity}`,
  Pairs_Ranking = `${MainPathEndpoint.Pairs}-${SubPathEndpoint.Ranking}`,
  Trends_General = `${MainPathEndpoint.Trends}-${SubPathEndpoint.General}`,
  Trends_Human_Rights = `${MainPathEndpoint.Trends}-${SubPathEndpoint.Human_Rights}`,
  Trends_Peace = `${MainPathEndpoint.Trends}-${SubPathEndpoint.Peace}`,
  VTT_News = `${MainPathEndpoint.VTT}-${SubPathEndpoint.News}`,
  VTT_Demands = `${MainPathEndpoint.VTT}-${SubPathEndpoint.Demands}`,
  VTT_Daily = `${MainPathEndpoint.VTT}-${SubPathEndpoint.Daily}`,
  Relationship = `${MainPathEndpoint.Relationship}`,
}

export enum MongoCollections {
  Ecopetrol = 'df_ecp',
  Locations = 'locations',
  PairsAffinity = 'df_peers_affinity',
  PairsRanking = 'df_peers_ranking',
  TrendsGeneral = 'df_trends',
  TrendsHumanRights = 'df_trends_hr',
  TrendsPeace = 'df_trends_peace',
  VTTDemands = 'df_vtt_claims',
  VTTNews = 'df_vtt_news',
  Relationship = 'df_grn',
}

export enum CommonMongoKeys {
  Affinity = 'affinity',
  Entity = 'entity',
  Location = 'location',
  LocationId = 'location_id',
  Polarity = 'polarity',
  Similarity = 'similarity',
  SourceCategory = 'source_category',
  SourceType = 'source_type',
  TextClean = 'text_clean',
  Timestamp = 'timestamp',
  Url = 'url',
}

export enum Polarity {
  Negative = 'Negativo',
  Neutral = 'Neutro',
  Positive = 'Positivo',
}

export enum LocationDataKeys {
  Affinity = CommonMongoKeys.Affinity,
  Impact = TrendsHumanRightsEnum.ImpactIndex,
  Risk = TrendsHumanRightsEnum.RiskIndex,
}
