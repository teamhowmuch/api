import { Test, TestingModule } from '@nestjs/testing';
import { BankConnectionsService } from './bank-connections.service';

describe('BankConnectionsService', () => {
  let service: BankConnectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankConnectionsService],
    }).compile();

    service = module.get<BankConnectionsService>(BankConnectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
