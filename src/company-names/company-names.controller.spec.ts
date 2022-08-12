import { Test, TestingModule } from '@nestjs/testing'
import { CompanyNamesController } from './company-names.controller'

describe('CompanyNamesController', () => {
  let controller: CompanyNamesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyNamesController],
    }).compile()

    controller = module.get<CompanyNamesController>(CompanyNamesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
