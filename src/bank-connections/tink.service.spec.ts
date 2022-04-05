import { Test, TestingModule } from '@nestjs/testing'
import { TinkService } from './tink.service'

describe('TinkService', () => {
  let service: TinkService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TinkService],
    }).compile()

    service = module.get<TinkService>(TinkService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
