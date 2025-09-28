import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EcopetrolController } from './ecopetrol.controller';
import { EcopetrolSchema } from './ecopetrol.schema';
import { EcopetrolService } from './ecopetrol.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'df_ecp', schema: EcopetrolSchema }]),
  ],
  controllers: [EcopetrolController],
  providers: [EcopetrolService],
})
export class EcopetrolModule {}
