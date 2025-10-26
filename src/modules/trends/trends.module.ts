import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MongoCollections } from 'src/utils';

import { TrendsController } from './trends.controller';
import {
  TrendsGeneralSchema,
  TrendsHumanRightsSchema,
  TrendsPeaceSchema,
} from './trends.schema';
import { TrendsService } from './trends.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoCollections.TrendsGeneral, schema: TrendsGeneralSchema },
      {
        name: MongoCollections.TrendsHumanRights,
        schema: TrendsHumanRightsSchema,
      },
      { name: MongoCollections.TrendsPeace, schema: TrendsPeaceSchema },
    ]),
  ],
  controllers: [TrendsController],
  providers: [TrendsService],
})
export class TrendsModule {}
