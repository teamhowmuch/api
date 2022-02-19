import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class ImportController {
  constructor(private transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  triggerImport(@Req() req: AuthenticatedRequest) {
    const {
      user: { id: userId },
    } = req;
    return this.transactionsService.importTransactions(userId);
  }
}
