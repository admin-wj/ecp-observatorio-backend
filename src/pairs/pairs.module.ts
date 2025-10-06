import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MongoCollections } from 'src/common';

import { PairsController } from './pairs.controller';
import { PairsAffinitySchema, PairsRankingSchema } from './pairs.schema';
import { PairsService } from './pairs.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoCollections.PairsAffinity, schema: PairsAffinitySchema },
      { name: MongoCollections.PairsRanking, schema: PairsRankingSchema },
    ]),
  ],
  controllers: [PairsController],
  providers: [PairsService],
})
export class PairsModule {}
