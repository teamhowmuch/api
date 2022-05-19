import { Body, Controller, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common'
import { Type } from 'class-transformer'
import { IsDate, IsOptional } from 'class-validator'
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { RoleEnum } from 'src/entities/UserRole'
import { TransactionsService } from './transactions.service'
import { verifyAccess } from 'src/auth/verifyAccess'

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

@Controller('users/:userId/transactions')
export class ImportController {
  constructor(private transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createImport(
    @Req() { user }: AuthenticatedRequest,
    @Body() body: TriggerImportDto,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    verifyAccess(user, userId, [RoleEnum.ADMIN])

    return this.transactionsService.createImport(userId, body)
  }
}
