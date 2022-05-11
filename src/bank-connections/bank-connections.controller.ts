import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common'
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { verifyAccess } from 'src/transactions/transactions.controller'

import { BankConnectionsService } from './bank-connections.service'
import { CreateConnectionDto } from './dto/create-connection'

@Controller('users/:userId/bank-connections')
export class BankConnectionsController {
  private logger = new Logger(BankConnectionsController.name)

  constructor(private bankConnections: BankConnectionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  list(@Request() req: AuthenticatedRequest, @Param('userId', ParseIntPipe) userId: number) {
    verifyAccess(req.user, userId)
    return this.bankConnections.list(userId)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':bankConnectionId')
  async getOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bankConnectionId', ParseIntPipe) bankConnectionId: number,
    @Request() req: AuthenticatedRequest,
  ) {
    verifyAccess(req.user, userId)
    const connection = await this.bankConnections.getOne(bankConnectionId)
    if (connection.user_id !== userId) {
      throw new NotFoundException('Not found')
    }
    return connection
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':bankConnectionId')
  getUserBankConnectionsWithRefresh(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bankConnectionId', ParseIntPipe) bankConnectionId: number,
    @Request() req: AuthenticatedRequest,
  ) {
    verifyAccess(req.user, userId)
    return this.bankConnections.update(bankConnectionId)
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createUserBankConnections(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateConnectionDto,
  ) {
    verifyAccess(req.user, userId)
    const res = await this.bankConnections.create(dto.bank_id, userId, dto.redirect_url)
    return res
  }
}
