import { Test, TestingModule } from '@nestjs/testing';

import { RAGController } from './rag.controller';

describe('RAGController', () => {
  let controller: RAGController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RAGController],
    }).compile();

    controller = module.get<RAGController>(RAGController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
