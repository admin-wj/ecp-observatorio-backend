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
}

export enum CommonMongoKeys {
  Affinity = 'affinity',
  Entity = 'entity',
  Location = 'location',
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
  Impact = 'impact_index',
  Risk = 'risk_index',
}
