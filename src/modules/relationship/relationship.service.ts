import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  Filters,
  getDBData,
  getMongoQuery,
  MongoCollections,
  relationshipQueryKeys,
  RelationshipResponse,
} from 'src/utils';

import { Relationship } from './relationship.schema';

@Injectable()
export class RelationshipService {
  constructor(
    @InjectModel(MongoCollections.Relationship)
    private relationshipModel: Model<Relationship>,
  ) {}

  async findRelationshipData(filters: Filters): Promise<RelationshipResponse> {
    const query = getMongoQuery(filters, 7, relationshipQueryKeys);

    const rawData = await getDBData<Relationship>(
      this.relationshipModel,
      query,
      undefined,
    );

    return {
      rawData,
      fullQuery: query,
      count: rawData.length,
    };
  }
}
