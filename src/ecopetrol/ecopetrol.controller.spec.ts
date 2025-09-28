import { Test, TestingModule } from '@nestjs/testing';

import { EcopetrolController } from './ecopetrol.controller';

describe('EcopetrolController', () => {
  let controller: EcopetrolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EcopetrolController],
    }).compile();

    controller = module.get<EcopetrolController>(EcopetrolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
