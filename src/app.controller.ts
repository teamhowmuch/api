import { Controller, Get, MethodNotAllowedException } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  get(): MethodNotAllowedException {
    return new MethodNotAllowedException()
  }
}
