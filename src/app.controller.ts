import { Controller, Get, Logger, MethodNotAllowedException } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  private logger = new Logger(AppController.name)

  constructor(private readonly appService: AppService) {
    this.logger.debug('Starting app')
  }

  @Get()
  get(): MethodNotAllowedException {
    return new MethodNotAllowedException()
  }

  @Get('error')
  generateError() {
    throw new Error('Some error')
  }

  @Get('log')
  generateLog() {
    this.logger.log('A log was logged')
    return true
  }
}
