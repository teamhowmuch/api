import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { BankConnectionsService } from 'src/bank-connections/bank-connections.service'
import { Transaction } from 'src/bank-connections/models/transaction'
import { DateFilter, NordigenService } from 'src/bank-connections/nordigen.service'
import { Transaction as TransactionEntity } from '../entities/Transaction'
import { FindManyOptions, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UserBankConnection } from 'src/entities/UserBankConnection'
import { TransactionProcessor } from './transactionProcessor.service'

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name)

  constructor(
    private transactionProcessorService: TransactionProcessor,
    private bankConnectionService: BankConnectionsService,
    private nordigenService: NordigenService,
    @InjectRepository(TransactionEntity)
    private transactionRepo: Repository<TransactionEntity>,
  ) {}

  async findOne(options: FindManyOptions<TransactionEntity>) {
    return this.transactionRepo.findOne(options)
  }

  // Todo change into queue processor?
  async fetchAccountTransactions(
    accountId: string,
    dateFilter?: DateFilter,
  ): Promise<Transaction[]> {
    // const transactions = await this.nordigenService.getAccountTransactions(accountId, dateFilter)
    const transactions = await this.nordigenService.mockGetAccountTransactions(
      accountId,
      dateFilter,
    )
    return transactions.booked
  }

  // Todo change into queue processor?
  async importAccountTransactions(
    bankConnection: UserBankConnection,
    accountId: string,
    dateFilter?: DateFilter,
  ) {
    const account = bankConnection.account_details_data.find((el) => (el.nordigenId = accountId))
    if (!account) {
      throw new NotFoundException(`No account with id ${accountId}`)
    }

    this.logger.debug(
      `importing transactions for bankAccount ${accountId} - ${bankConnection.requisition_data.institution_id}`,
    )

    const transactions = await this.fetchAccountTransactions(accountId, dateFilter)
    for (const transaction of transactions) {
      await this.transactionProcessorService.process({ account, transaction, bankConnection })
    }
  }

  // Todo change into queue processor?
  async importConnectionTransactions(bankConnection: UserBankConnection, dateFilter?: DateFilter) {
    this.logger.debug(`importing transactions for bankConnection ${bankConnection.id}`)
    for (const { nordigenId } of bankConnection.account_details_data) {
      await this.importAccountTransactions(bankConnection, nordigenId, dateFilter)
    }
  }

  async importUserTransaction(userId: number, dateFilter?: DateFilter) {
    this.logger.debug(`importing transactions for user ${userId}`)
    const userBankConnections = await this.bankConnectionService.list(userId)
    this.logger.debug(`user has ${userBankConnections.length} connections`)

    for (const connection of userBankConnections) {
      // TODO REMOVE THIS ID
      if (connection.requisition_data.status === 'LN') {
        if (!connection.account_details_data) {
          await this.bankConnectionService.update(connection.id)
        }

        await this.importConnectionTransactions(connection, dateFilter)
      }
    }
  }

  async saveTransaction(entity: TransactionEntity) {
    return this.transactionRepo.save(entity)
  }
}
