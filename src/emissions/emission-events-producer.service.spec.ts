import { Test, TestingModule } from '@nestjs/testing';
import { EmissionEventsProducerService } from './emission-events-producer.service';

describe('EmissionEventsProducerService', () => {
  let service: EmissionEventsProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmissionEventsProducerService],
    }).compile();

    service = module.get<EmissionEventsProducerService>(EmissionEventsProducerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
