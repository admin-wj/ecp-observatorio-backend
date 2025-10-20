import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MongoCollections } from 'src/utils';

import { VTTController } from './vtt.controller';
import { VTTNewsSchema } from './vtt.schema';
import { VTTService } from './vtt.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoCollections.VTTNews, schema: VTTNewsSchema },
    ]),
  ],
  controllers: [VTTController],
  providers: [VTTService],
})
export class VTTModule {}
