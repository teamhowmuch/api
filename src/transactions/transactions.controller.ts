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
import { IsDate, IsEnum, IsInt, IsOptional } from 'class-validator'
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { RoleEnum } from 'src/entities/UserRole'
import { TransactionsService } from './transactions.service'
import { verifyAccess } from 'src/auth/verifyAccess'

enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

enum OrderByField {
  id = 'id',
  booking_date = 'booking_date',
}

class ListTransactionsDto {
  @Type(() => Number) @IsInt() @IsOptional() limit: number
  @Type(() => Number) @IsInt() @IsOptional() offset: number

  @IsEnum(OrderByField) @IsOptional() order_by: string
  @IsEnum(OrderDirection) @IsOptional() order_direction: OrderDirection
}

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

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(
    @Req() { user }: AuthenticatedRequest,
    @Param('userId', ParseIntPipe) userId: number,
    @Query()
    {
      order_by = OrderByField.booking_date,
      order_direction = OrderDirection.DESC,
      offset = 0,
      limit = 25,
    }: ListTransactionsDto,
  ) {
    verifyAccess(user, userId, [RoleEnum.ADMIN])

    const [data, count] = await this.transactionsService.find({
      where: { user_id: userId },
      order: {
        [order_by]: order_direction === 'ASC' ? 'ASC' : 'DESC',
      },
      take: limit,
      skip: offset,
    })

    return { data, count }
  }
}
