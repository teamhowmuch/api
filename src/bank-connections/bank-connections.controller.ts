import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common'
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/jwt-auth.guard'

import { BankConnectionsService } from './bank-connections.service'
import { CreateConnectionDto } from './dto/create-connection'

@Controller('bank-connections')
export class BankConnectionsController {
  constructor(private bankConnections: BankConnectionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  getUserBankConnections(@Request() req: AuthenticatedRequest) {
    const { user } = req
    return this.bankConnections.listBankConnections(user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  getUserBankConnectionsWithRefresh(@Param('id', ParseIntPipe) id: number) {
    return this.bankConnections.update(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('list-banks')
  listBanks() {
    return this.bankConnections.getBanks()
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createUserBankConnections(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateConnectionDto,
  ) {
    const { user } = req
    const res = await this.bankConnections.create(dto.bankId, dto.transaction_days_total, user.id)
    return res
  }
}
