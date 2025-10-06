export enum MongoCollections {
  Ecopetrol = 'df_ecp',
  PairsAffinity = 'df_peers_affinity',
  PairsRanking = 'df_peers_ranking',
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
