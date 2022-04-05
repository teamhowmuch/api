import { Test, TestingModule } from '@nestjs/testing';
import { OverheidService } from './overheid.service';

describe('OverheidService', () => {
  let service: OverheidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OverheidService],
    }).compile();

    service = module.get<OverheidService>(OverheidService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
