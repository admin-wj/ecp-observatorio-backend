import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { LocationsEnum, MongoCollections } from 'src/utils';

export type LocationsDocument = Locations & Document;

@Schema({ collection: MongoCollections.Locations })
export class Locations {
  @Prop() [LocationsEnum.LocationId]: string;
  @Prop() [LocationsEnum.LocationName]: string;
  @Prop({ type: { lat: Number, long: Number } }) [LocationsEnum.Location]: {
    lat: number;
    long: number;
  };
  @Prop() [LocationsEnum.StateId]: string;
  @Prop() [LocationsEnum.State]: string;
  @Prop() [LocationsEnum.Region]: string;
  @Prop() [LocationsEnum.RegionEcp]: string;
  @Prop() [LocationsEnum.IsCapital]: boolean;
}

export const LocationsSchema = SchemaFactory.createForClass(Locations);
