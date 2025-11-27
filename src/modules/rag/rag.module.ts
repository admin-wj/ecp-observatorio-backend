import { Module } from '@nestjs/common';

import { RAGController } from './rag.controller';
import { RAGService } from './rag.service';

import { EcopetrolModule } from '../ecopetrol/ecopetrol.module';
import { PairsModule } from '../pairs/pairs.module';
import { RelationshipModule } from '../relationship/relationship.module';
import { TrendsModule } from '../trends/trends.module';
import { VTTModule } from '../vtt/vtt.module';

@Module({
  imports: [EcopetrolModule, PairsModule, RelationshipModule, TrendsModule, VTTModule],
  controllers: [RAGController],
  providers: [RAGService],
})
export class RAGModule { }
