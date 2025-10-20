import { Test, TestingModule } from '@nestjs/testing';

import { EcopetrolService } from './ecopetrol.service';

describe('EcopetrolService', () => {
  let service: EcopetrolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EcopetrolService],
    }).compile();

    service = module.get<EcopetrolService>(EcopetrolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
