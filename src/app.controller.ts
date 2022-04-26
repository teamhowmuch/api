import {
  Controller,
  Get,
  Logger,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common'
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
    throw new NotFoundException()
  }
}
