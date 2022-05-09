import { Test, TestingModule } from '@nestjs/testing';
import { UsersFlightsController } from './users-flights.controller';

describe('UsersFlightsController', () => {
  let controller: UsersFlightsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersFlightsController],
    }).compile();

    controller = module.get<UsersFlightsController>(UsersFlightsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
