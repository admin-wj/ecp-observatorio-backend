import { Module } from '@nestjs/common';

import { RAGController } from './rag.controller';
import { RAGService } from './rag.service';

@Module({
  imports: [],
  controllers: [RAGController],
  providers: [RAGService],
})
export class RAGModule {}
