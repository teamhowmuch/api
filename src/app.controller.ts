import { Controller, Get, Logger } from '@nestjs/common'

@Controller()
export class AppController {
  private logger = new Logger(AppController.name)

  @Get('')
  get() {
    return { how: 'much' }
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
