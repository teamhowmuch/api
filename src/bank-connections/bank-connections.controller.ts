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
} from '@nestjs/common';
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { BankConnectionsService } from './bank-connections.service';
import { CreateRedirectDto } from './dto/create-redirect.dto';

@Controller('bank-connections')
export class BankConnectionsController {
  constructor(private bankConnections: BankConnectionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  getUserBankConnections(@Request() req: AuthenticatedRequest) {
    const { user } = req;
    return this.bankConnections.listBankConnections(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/requisition')
  getUserBankConnectionsWithRefresh(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    // const { user } = req;
    return this.bankConnections.update(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('list-banks')
  listBanks() {
    return this.bankConnections.getBanks();
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createUserBankConnections(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateRedirectDto,
  ) {
    const { user } = req;
    const res = await this.bankConnections.create(dto.bankId, user.id);
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/transactions')
  async getTransactions(
    @Param('id', ParseIntPipe) connectionId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    console.log('getting transactions for this id');
    console.log(connectionId);

    const {
      user: { id: userId },
    } = req;

    console.log(req.user)

    const res = await this.bankConnections.getTransactions(
      connectionId,
      userId,
    );

    console.log(res);

    return res;
  }
}
