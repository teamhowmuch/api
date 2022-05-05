import {
  Body,
  Controller,
  ForbiddenException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { Type } from 'class-transformer'
import { IsDate, IsOptional } from 'class-validator'
import { AuthenticatedRequest, JwtAuthGuard, UserPayload } from 'src/auth/jwt-auth.guard'
import { RoleEnum } from 'src/entities/UserRole'
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

export function verifyAccess(user: UserPayload, requestUserId: number, requiredRoles?: RoleEnum[]) {
  if (requiredRoles.every((role) => user.roles.includes(role))) {
    return true
  } else if (user.id === requestUserId) {
    return true
  } else {
    throw new ForbiddenException()
  }
}

@Controller('users/:userId/transactions')
export class ImportController {
  constructor(private transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  triggerImport(
    @Req() { user }: AuthenticatedRequest,
    @Body() body: TriggerImportDto,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    verifyAccess(user, userId, [RoleEnum.ADMIN])

    return this.transactionsService.importUserTransaction(userId, body)
  }
}
