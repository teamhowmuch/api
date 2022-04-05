import { Test, TestingModule } from '@nestjs/testing'
// import { EmissionEvent, SourceType } from 'src/entities/EmissionEvent'
import { EmissionEventsService } from './emission-events.service'

describe('EmissionEventsService', () => {
  let service: EmissionEventsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmissionEventsService],
    }).compile()

    service = module.get<EmissionEventsService>(EmissionEventsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  // it('should be able to create an emission event', async () => {
  //   const res = await service.create(
  //     2,
  //     120,
  //     SourceType.transaction,
  //     10,
  //     new Date('2022-01-01 01:00:00'),
  //   )
  //   expect(res.id).toBeDefined()
  // })
})
