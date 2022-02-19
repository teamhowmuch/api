import { Test, TestingModule } from '@nestjs/testing';
import { DetermineEmissionsService } from './determine-emissions.service';

describe('DetermineEmissionsService', () => {
  let service: DetermineEmissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetermineEmissionsService],
    }).compile();

    service = module.get<DetermineEmissionsService>(DetermineEmissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
