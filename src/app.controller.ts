import { Controller, Get, Logger } from '@nestjs/common'
import { Connection } from 'typeorm'

@Controller()
export class AppController {
  private logger = new Logger(AppController.name)

  constructor(private connection: Connection) {
    console.log(process.env.JWT_SECRET)
  }

  @Get()
  async get() {
    const dbRes = await this.connection.query('SELECT 1')
    return { api: 'ok', db: dbRes ? 'ok' : 'not ok' }
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
