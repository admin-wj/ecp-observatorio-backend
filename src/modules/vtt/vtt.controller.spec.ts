import { Test, TestingModule } from '@nestjs/testing';

import { VTTController } from './vtt.controller';

describe('VTTController', () => {
  let controller: VTTController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VTTController],
    }).compile();

    controller = module.get<VTTController>(VTTController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
