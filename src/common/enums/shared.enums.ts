export enum MongoCollections {
  Ecopetrol = 'df_ecp',
  PairsAffinity = 'df_peers_affinity',
  PairsRanking = 'df_peers_ranking',
  TrendsGeneral = 'df_trends',
  TrendsHumanRights = 'df_trends_hr',
  TrendsPeace = 'df_trends_peace',
  VTTNews = 'df_vtt_news',
  VTTDemands = 'df_vtt_claims',
  Locations = 'locations',
}

export enum CommonMongoKeys {
  Timestamp = 'timestamp',
  Entity = 'entity',
  Affinity = 'affinity',
  Location = 'location',
  Polarity = 'polarity',
  TextClean = 'text_clean',
  Url = 'url',
}

export enum Polarity {
  Negative = 'Negativo',
  Neutral = 'Neutro',
  Positive = 'Positivo',
}

export enum LocationDataKeys {
  Affinity = CommonMongoKeys.Affinity,
  Risk = 'risk_index',
  Impact = 'impact_index',
}
