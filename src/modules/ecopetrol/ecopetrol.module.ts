import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MongoCollections } from 'src/utils';

import { EcopetrolController } from './ecopetrol.controller';
import { EcopetrolSchema } from './ecopetrol.schema';
import { EcopetrolService } from './ecopetrol.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoCollections.Ecopetrol, schema: EcopetrolSchema },
    ]),
  ],
  controllers: [EcopetrolController],
  providers: [EcopetrolService],
})
export class EcopetrolModule {}
