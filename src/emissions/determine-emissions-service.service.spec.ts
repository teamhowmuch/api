import { Test, TestingModule } from '@nestjs/testing';
import { DetermineEmissionsServiceService } from './determine-emissions-service.service';

describe('DetermineEmissionsServiceService', () => {
  let service: DetermineEmissionsServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetermineEmissionsServiceService],
    }).compile();

    service = module.get<DetermineEmissionsServiceService>(DetermineEmissionsServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
