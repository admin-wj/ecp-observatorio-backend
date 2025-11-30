import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { MongoCollections, getDBData } from 'src/utils';

import { Locations } from './locations.schema';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(MongoCollections.Locations)
    private locationsModel: Model<Locations>,
  ) {}

  async findLocationsData(): Promise<Locations[]> {
    const rawData = await getDBData<Locations>(
      this.locationsModel,
      {},
      {
        state: 1,
        location_name: 1,
      },
    );
    if (!rawData || rawData.length === 0)
      throw new Error('Locations not found');

    return rawData;
  }

  async findLocationsDataById(id: string): Promise<Locations> {
    const rawData = await getDBData<Locations>(
      this.locationsModel,
      {
        _id: id,
      },
      {
        state: 1,
        location_name: 1,
      },
    );

    if (!rawData || rawData.length === 0) throw new Error('Location not found');

    return rawData[0];
  }
}
