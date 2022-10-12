import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { EmailController } from './email.controller'
import { McService } from './mc/mc.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  providers: [EmailService, McService],
  exports: [EmailService, McService],
  controllers: [EmailController],
})
export class EmailModule {}
