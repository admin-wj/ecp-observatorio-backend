import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  ActorSummary,
  ComponentSummary,
  Filters,
  getDataByCity,
  getDBData,
  getMongoQuery,
  getVTTGroupedData,
  MapChartData,
  MongoCollections,
  vttDailyQueryKeys,
  VTTDailyResponse,
  vttDemandsQueryKeys,
  VTTDemandsResponse,
  VTTEnum,
  vttNewsQueryKeys,
  VTTNewsResponse,
} from 'src/utils';

import { VTTNews } from './vtt.schema';

@Injectable()
export class VTTService {
  constructor(
    @InjectModel(MongoCollections.VTTNews)
    private vttModel: Model<VTTNews>,
  ) {}

  async findNewsData(filters: Filters): Promise<VTTNewsResponse> {
    const query = getMongoQuery(filters, 7, vttNewsQueryKeys);

    const rawData = await getDBData<VTTNews>(this.vttModel, query, {
      timestamp: -1,
      similarity_vtt: -1,
    });

    const dataByComp = getVTTGroupedData<
      VTTEnum.Component,
      VTTEnum.Subcomponent
    >(
      rawData,
      filters.extraFilters[VTTEnum.Component] || [],
      VTTEnum.Component,
      filters.extraFilters[VTTEnum.Subcomponent] || [],
      VTTEnum.Subcomponent,
    ) as ComponentSummary[];

    return {
      rawData,
      dataByComp,
      fullQuery: query,
      count: rawData.length,
    };
  }

  async findDemandsData(filters: Filters): Promise<VTTDemandsResponse> {
    const query = getMongoQuery(filters, 7, vttDemandsQueryKeys);

    const rawData = await getDBData<VTTNews>(this.vttModel, query, {
      timestamp: -1,
      similarity_vtt: -1,
    });

    const dataByActor = getVTTGroupedData<VTTEnum.ClaimActor, undefined>(
      rawData,
      filters.extraFilters[VTTEnum.ClaimActor] || [],
      VTTEnum.ClaimActor,
    ) as ActorSummary[];

    const dataByCity = getDataByCity<VTTNews>(rawData) as MapChartData[];

    return {
      rawData,
      dataByActor,
      dataByCity,
      fullQuery: query,
      count: rawData.length,
    };
  }

  async findDailyData(filters: Filters): Promise<VTTDailyResponse> {
    const query = getMongoQuery(filters, 1, vttDailyQueryKeys);

    return {
      fullQuery: query,
    };
  }
}
