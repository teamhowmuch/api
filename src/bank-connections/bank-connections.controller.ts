import {
  Body,
  Controller,
  Get,
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

import { BankConnectionsService } from './bank-connections.service'
import { CreateConnectionDto } from './dto/create-connection'

@Controller('bank-connections')
export class BankConnectionsController {
  constructor(private bankConnections: BankConnectionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  list(@Request() req: AuthenticatedRequest) {
    const { user } = req
    return this.bankConnections.list(user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    const { user } = req
    const connection = await this.bankConnections.getOne(id)
    if (connection.userId !== user.id) {
      throw new NotFoundException('Not found')
    }
    return connection
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  getUserBankConnectionsWithRefresh(@Param('id', ParseIntPipe) id: number) {
    return this.bankConnections.update(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createUserBankConnections(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateConnectionDto,
  ) {
    const { user } = req
    const res = await this.bankConnections.create(dto.bankId, user.id)
    return res
  }
}
