import { Test, TestingModule } from '@nestjs/testing'
import { UsersCarsController } from './users-cars.controller'

describe('UsersCarsController', () => {
  let controller: UsersCarsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersCarsController],
    }).compile()

    controller = module.get<UsersCarsController>(UsersCarsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
