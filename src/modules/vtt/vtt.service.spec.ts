import { Test, TestingModule } from '@nestjs/testing';

import { VTTService } from './vtt.service';

describe('VTTService', () => {
  let service: VTTService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VTTService],
    }).compile();

    service = module.get<VTTService>(VTTService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
