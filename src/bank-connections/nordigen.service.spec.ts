import { Test, TestingModule } from '@nestjs/testing';
import { NordigenService } from './nordigen.service';

describe('NordigenService', () => {
  let service: NordigenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NordigenService],
    }).compile();

    service = module.get<NordigenService>(NordigenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
