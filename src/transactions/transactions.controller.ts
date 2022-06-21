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
import { RoleEnum } from 'src/entities/UserRole'
import { TransactionsService } from './transactions.service'
import { Transaction as TransactionEntity } from '../entities/Transaction'
import { verifyAccess } from 'src/auth/verifyAccess'
import { SearchInput } from 'src/search/searchInput'
import { SearchResults } from 'src/search/searchResults'

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
    @Query() query: SearchInput,
  ): Promise<SearchResults<TransactionEntity>> {
    verifyAccess(user, userId, [RoleEnum.ADMIN])

    const searchInput: SearchInput = {
      limit: query.limit,
      offset: query.offset,
      orderByDirection: query.orderByDirection,
      orderByField: query.orderByField,
    }

    return this.transactionsService.list(searchInput, userId)
  }
}
