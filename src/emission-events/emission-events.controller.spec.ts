import { Test, TestingModule } from '@nestjs/testing'
import { EmissionEventsController } from './emission-events.controller'

describe('EmissionEventsController', () => {
  let controller: EmissionEventsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmissionEventsController],
    }).compile()

    controller = module.get<EmissionEventsController>(EmissionEventsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
