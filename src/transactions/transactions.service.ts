import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { BankConnectionsService } from '../bank-connections/bank-connections.service'
import { Transaction } from '../bank-connections/models/transaction'
import { DateFilter, NordigenService } from '../bank-connections/nordigen.service'
import { Transaction as TransactionEntity } from '../entities/Transaction'
import { FindManyOptions, FindOneOptions, LessThan, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { RequisitionStatus, UserBankConnection } from '../entities/UserBankConnection'
import { TransactionProcessor } from './transactionProcessor.service'
import { BankImport, BankImportStatus } from 'src/entities/BankImport'
import { differenceInHours, subDays, subSeconds, subYears } from 'date-fns'
import { Cron, CronExpression } from '@nestjs/schedule'
import { AccountDetails } from 'src/bank-connections/models/AccountDetails'
import { UsersService } from 'src/users/users.service'
import { clean } from './clean'

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name)

  constructor(
    private usersService: UsersService,
    private transactionProcessorService: TransactionProcessor,
    private bankConnectionService: BankConnectionsService,
    private nordigenService: NordigenService,
    @InjectRepository(BankImport) private importsRepo: Repository<BankImport>,
    @InjectRepository(TransactionEntity)
    private transactionRepo: Repository<TransactionEntity>,
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
      await this.saveTransaction(transaction, bankConnection, account)
    }
  }

  async saveTransaction(
    transaction: Transaction,
    bankConnection: UserBankConnection,
    account: AccountDetails,
  ) {
    const user = await this.usersService.findOne({ where: { id: bankConnection.user_id } })
    const cleaned = await clean(transaction)
    const entity = new TransactionEntity()

    entity.id = cleaned.id
    entity.bank_connection_id = bankConnection.id
    entity.user_id = user.id

    entity.imported_at = new Date()

    if (user.is_beta_tester) {
      entity.booking_date = cleaned.bookingDate
      entity.amount = cleaned.amount
      entity.currency = cleaned.currency

      entity.remittance = cleaned.remittance
      entity.creditor = cleaned.creditorName
      entity.debtor = cleaned.debtorName

      entity.extracted_from_account_iban = account.iban
      entity.extracted_from_account_display = account.displayName
    }

    const saveResult = await this.transactionRepo.save(entity)
    await this.transactionProcessorService.process(saveResult, transaction, cleaned)
    return saveResult
  }

  async importConnectionTransactions(
    bankConnectionId: UserBankConnection['id'],
    dateFilter?: DateFilter,
  ) {
    const bankConnection = await this.bankConnectionService.update(bankConnectionId)
    if (bankConnection.requisition_status !== RequisitionStatus.VALID) {
      throw new Error(
        `Cannot import transactions from bankConnection. Requisition status is ${bankConnection.requisition_status}`,
      )
    }
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

        this.queueImport(connection.id, dateFilter)
        this.checkNewJob()
      }
    }
  }

  async queueImport(bankConnectionId: number, dateFilter?: DateFilter) {
    console.log('scheduling import')
    const bankImport = new BankImport()
    bankImport.date_to = dateFilter?.dateTo || new Date()
    bankImport.date_from = dateFilter?.dateFrom || subYears(new Date(), 1)
    bankImport.user_bank_connection_id = bankConnectionId
    await this.importsRepo.save(bankImport)
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async autoImportTransactions() {
    const allValidBankConnections = await this.bankConnectionService.find({
      where: { requisition_status: RequisitionStatus.VALID },
    })

    for (const connection of allValidBankConnections) {
      const lastImport = await this.importsRepo
        .createQueryBuilder()
        .where('user_bank_connection_id = :id', { id: connection.id })
        .andWhere(`status IN ('${BankImportStatus.COMPLETED}','${BankImportStatus.ERROR}')`)
        .orderBy('started_at', 'DESC')

        .getOne()

      const plannedOrActive = await this.importsRepo
        .createQueryBuilder()
        .where('user_bank_connection_id = :id', { id: connection.id })
        .andWhere(`status IN ('${BankImportStatus.QUEUED}','${BankImportStatus.ACTIVE}')`)

        .getOne()

      this.logger.log(`Queueing import for bankConnection: ${connection.id}`)

      if (
        !plannedOrActive &&
        (!lastImport || differenceInHours(new Date(), lastImport.updated_at) > 1)
      ) {
        await this.queueImport(connection.id, {
          dateFrom: subDays(new Date(), 2),
          dateTo: new Date(),
        })
      }
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async checkStaleJobs() {
    const staleJob = await this.importsRepo.findOne({
      status: BankImportStatus.ACTIVE,
      started_at: LessThan(subSeconds(new Date(), 120)),
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

  async find(options: FindManyOptions<TransactionEntity>) {
    return this.transactionRepo.findAndCount(options)
  }

  async updateTransaction(entity: TransactionEntity) {
    return this.transactionRepo.save(entity)
  }
}
