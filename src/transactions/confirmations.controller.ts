import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common'
import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator'
import { Request } from 'express'
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { ConfirmationStatus } from 'src/entities/TransactionConfirmation'
import { TransactionCategory } from './categories'
import { ConfirmationService } from './confirmation.service'
import { TransactionsService } from './transactions.service'

export class FindParams {
  @IsOptional()
  @IsEnum(ConfirmationStatus)
  status?: ConfirmationStatus

  @IsOptional()
  @IsEnum(TransactionCategory)
  category?: TransactionCategory

  @IsOptional()
  @IsPositive()
  @IsInt()
  page?: number
}

@Controller('transaction-confirmations')
export class ConfirmationsController {
  constructor(
    private confirmationService: ConfirmationService,
    private transactionService: TransactionsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async find(@Req() req: AuthenticatedRequest, @Query() params: FindParams) {
    const { user } = req
    const { status, category, page } = params

    return this.confirmationService.search({ userId: user.id, status, category, page })
  }
}
