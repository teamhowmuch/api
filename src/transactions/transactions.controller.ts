import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { Type } from 'class-transformer'
import { IsDate, IsOptional } from 'class-validator'
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { DateFilter } from 'src/bank-connections/nordigen.service'
import { TransactionsService } from './transactions.service'

class TriggerImportDto {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  readonly dateFrom?: Date

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  readonly dateTo?: Date
}

@Controller('transactions')
export class ImportController {
  constructor(private transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  triggerImport(@Req() req: AuthenticatedRequest, @Body() body: TriggerImportDto) {
    const {
      user: { id: userId },
    } = req
  
    return this.transactionsService.importUserTransaction(userId, body)
  }
}
