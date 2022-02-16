import { Test, TestingModule } from '@nestjs/testing';
import { BankConnectionsController } from './bank-connections.controller';

describe('BankConnectionsController', () => {
  let controller: BankConnectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankConnectionsController],
    }).compile();

    controller = module.get<BankConnectionsController>(BankConnectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
