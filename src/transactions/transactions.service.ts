import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { BankConnectionsService } from '../bank-connections/bank-connections.service'
import { Transaction } from '../bank-connections/models/transaction'
import { DateFilter, NordigenService } from '../bank-connections/nordigen.service'
import { Transaction as TransactionEntity } from '../entities/Transaction'
import { FindOneOptions, LessThan, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UserBankConnection } from '../entities/UserBankConnection'
import { TransactionProcessor } from './transactionProcessor.service'
import { TransactionAnonymized } from '../entities/TransactionAnonymized'
import { BankImport, BankImportStatus } from 'src/entities/BankImport'
import { subSeconds, subYears } from 'date-fns'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name)

  constructor(
    private transactionProcessorService: TransactionProcessor,
    private bankConnectionService: BankConnectionsService,
    private nordigenService: NordigenService,
    @InjectRepository(BankImport) private importsRepo: Repository<BankImport>,
    @InjectRepository(TransactionEntity)
    private transactionRepo: Repository<TransactionEntity>,
    @InjectRepository(TransactionAnonymized)
    private anonymTransactionRepo: Repository<TransactionAnonymized>,
  ) {}

  async findOne(options: FindOneOptions<TransactionEntity>) {
    return this.transactionRepo.findOne(options)
  }

  // Todo change into queue processor?
  async fetchAccountTransactions(
    accountId: string,
    dateFilter?: DateFilter,
  ): Promise<Transaction[]> {
    const transactions = await this.nordigenService.getAccountTransactions(accountId, dateFilter)
    // const transactions = await this.nordigenService.mockGetAccountTransactions()
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

    this.logger.debug(`importing transactions bank: ${bankConnection.bank.name}`)

    const transactions = await this.fetchAccountTransactions(accountId, dateFilter)
    for (const transaction of transactions) {
      await this.transactionProcessorService.process({ account, transaction, bankConnection })
    }
  }

  // Todo change into queue processor?
  async importConnectionTransactions(
    bankConnectionId: UserBankConnection['id'],
    dateFilter?: DateFilter,
  ) {
    const bankConnection = await this.bankConnectionService.getOne(bankConnectionId)
    this.logger.debug(`importing transactions for bankConnection ${bankConnection.id}`)
    for (const { nordigenId } of bankConnection.account_details_data) {
      await this.importAccountTransactions(bankConnection, nordigenId, dateFilter)
    }
  }

  async createImport(userId: number, dateFilter?: DateFilter) {
    this.logger.debug(`creating new import batch for user ${userId}`)
    const userBankConnections = await this.bankConnectionService.list(userId)
    this.logger.debug(`user has ${userBankConnections.length} connections`)

    for (const connection of userBankConnections) {
      if (connection.requisition_data.status === 'LN') {
        if (!connection.account_details_data) {
          await this.bankConnectionService.update(connection.id)
        }

        const existingBatch = await this.importsRepo.findOne({
          where: { user_bank_connection_id: connection.id, status: BankImportStatus.QUEUED },
        })

        if (existingBatch) {
          return
        }

        const bankImport = new BankImport()
        bankImport.date_to = dateFilter.dateTo || new Date()
        bankImport.date_from = dateFilter.dateFrom || subYears(new Date(), 1)
        bankImport.user_bank_connection_id = connection.id
        await this.importsRepo.save(bankImport)
        this.checkNewJob()
      }
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async checkStaleJobs() {
    const staleJob = await this.importsRepo.findOne({
      status: BankImportStatus.ACTIVE,
      started_at: LessThan(subSeconds(new Date(), 90)),
    })

    if (staleJob) {
      staleJob.status = BankImportStatus.ERROR
      staleJob.error = { error: 'timeout' }
      await this.importsRepo.save(staleJob)
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async checkNewJob() {
    const activeJob = await this.importsRepo.findOne({ status: BankImportStatus.ACTIVE })
    if (activeJob) {
      return
    }

    const nextJob = await this.importsRepo.findOne({
      where: { status: BankImportStatus.QUEUED },
      order: {
        priority: 'ASC',
        created_at: 'DESC',
      },
    })

    if (nextJob) {
      nextJob.started_at = new Date()
      nextJob.status = BankImportStatus.ACTIVE
      await this.importsRepo.save(nextJob)

      this.logger.debug(`Picking up import job ${nextJob.id}`)

      try {
        await this.importConnectionTransactions(nextJob.user_bank_connection_id, {
          dateFrom: nextJob.date_from,
        })
        nextJob.completed_at = new Date()
        nextJob.status = BankImportStatus.COMPLETED
        this.logger.debug(`Job ${nextJob.id} completed`)
        await this.importsRepo.save(nextJob)
      } catch (error) {
        nextJob.status = BankImportStatus.ERROR
        nextJob.error = JSON.stringify(error)
        this.logger.error(error)
        console.error(error)
        await this.importsRepo.save(nextJob)
      }
    }
  }

  async saveTransaction(entity: TransactionEntity) {
    return this.transactionRepo.save(entity)
  }

  async saveAnonymizedTransaction(aTransaction: TransactionAnonymized) {
    console.log('saving', aTransaction)
    return this.anonymTransactionRepo.save(aTransaction)
  }
}
