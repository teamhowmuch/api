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

import { BankConnectionsService } from './bank-connections.service'
import { CreateConnectionDto } from './dto/create-connection'

@Controller('bank-connections')
export class BankConnectionsController {
  private logger = new Logger(BankConnectionsController.name)

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
    if (connection.user_id !== user.id) {
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
    const res = await this.bankConnections.create(dto.bank_id, user.id, dto.redirect_url)
    return res
  }
}
