import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { randomUUID } from 'crypto'
import { RequisitionStatus, UserBankConnection } from '../entities/UserBankConnection'
import { UsersService } from '../users/users.service'
import { Connection, FindManyOptions, IsNull, Not, Repository } from 'typeorm'
import { DEFAULT_REQUISITION_VALIDITY, NordigenService } from './nordigen.service'
import { AccountDetails } from './models/AccountDetails'
import { addDays, differenceInHours } from 'date-fns'
import { BanksService } from './banks.service'
import { BankImport, BankImportStatus } from 'src/entities/BankImport'
import { Cron, CronExpression } from '@nestjs/schedule'
import { User } from 'src/entities/User'

// const ALLOWED_REDIRECT_URLS = ['exp://192.168.178.20:19000']

const STATUS_MAP: Record<string, RequisitionStatus> = {
  CR: RequisitionStatus.INITIAL,
  GC: RequisitionStatus.INITIAL,
  UA: RequisitionStatus.INITIAL,
  RJ: RequisitionStatus.BROKEN,
  SA: RequisitionStatus.INITIAL,
  GA: RequisitionStatus.INITIAL,
  LN: RequisitionStatus.VALID,
  EX: RequisitionStatus.EXPIRED,
  SU: RequisitionStatus.EXPIRED,
} as const

export interface BankConnectionWithLastImport extends UserBankConnection {
  last_successful_import?: BankImport
  last_import?: BankImport
}

@Injectable()
export class BankConnectionsService {
  private readonly logger = new Logger(BankConnectionsService.name)

  constructor(
    private connection: Connection,
    @InjectRepository(UserBankConnection)
    private bankConnectionRepo: Repository<UserBankConnection>,
    @InjectRepository(BankImport)
    private importsRepo: Repository<BankImport>,
    private banksService: BanksService,
    private usersService: UsersService,
    private nordigenService: NordigenService,
  ) {}

  async list(userId: number) {
    const user = this.usersService.findOne({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException('No user with that id found')
    }

    const bankConnections: BankConnectionWithLastImport[] = await this.bankConnectionRepo
      .createQueryBuilder('user_bank_connection')
      .leftJoinAndSelect('user_bank_connection.bank', 'bank')
      .where('user_id = :userId', { userId })
      .getMany()

    for (const bankConnection of bankConnections) {
      bankConnection.last_successful_import = await this.importsRepo
        .createQueryBuilder('bank_import')
        .where('user_bank_connection_id = :id', { id: bankConnection.id })
        .andWhere('status = :status', { status: BankImportStatus.COMPLETED })
        .orderBy('created_at', 'DESC')
        .getOne()

      bankConnection.last_import = await this.importsRepo
        .createQueryBuilder('bank_import')
        .where('user_bank_connection_id = :id', { id: bankConnection.id })
        .orderBy('created_at', 'DESC')
        .getOne()
    }

    return bankConnections
  }

  async find(options: FindManyOptions<UserBankConnection>) {
    return this.bankConnectionRepo.find(options)
  }

  async getOne(id: number): Promise<BankConnectionWithLastImport> {
    const res: BankConnectionWithLastImport = await this.bankConnectionRepo.findOne({
      where: { id },
      relations: ['bank'],
    })

    if (!res) {
      throw new NotFoundException(`No account with id ${id}`)
    }

    res.last_import = await this.importsRepo
      .createQueryBuilder('bank_import')
      .where('user_bank_connection_id = :id', { id })
      .orderBy('created_at', 'DESC')
      .getOne()

    res.last_successful_import = await this.importsRepo
      .createQueryBuilder('bank_import')
      .where('user_bank_connection_id = :id', { id })
      .andWhere('status = :status', { status: BankImportStatus.COMPLETED })
      .orderBy('created_at', 'DESC')
      .getOne()

    return res
  }

  async create(
    institutionId: string,
    userId: number,
    redirectUrl: string,
  ): Promise<UserBankConnection> {
    const user = await this.usersService.findOne({ where: { id: userId } })
    const bank = await this.banksService.findOne({ where: { id: institutionId } })
    const bankConnection = new UserBankConnection()
    bankConnection.user = user

    // Todo enable:
    // if (!ALLOWED_REDIRECT_URLS.includes(redirectUrl)) {
    //   throw new BadRequestException(`That redirect url is not allowed`)
    // }

    const reference = randomUUID()

    const agreement = await this.nordigenService.createAgreement({
      institutionId,
      maxHistoricalDays: Math.min(bank.transaction_total_days, 365),
    })

    const requisition = await this.nordigenService.createRequisition({
      redirectUrl,
      institutionId,
      reference,
      agreement: agreement.id,
    })

    bankConnection.requisition_data = requisition
    bankConnection.requisition_expires_at = addDays(new Date(), DEFAULT_REQUISITION_VALIDITY)
    bankConnection.bank_id = institutionId

    await this.bankConnectionRepo.save(bankConnection)

    return bankConnection
  }

  async update(bankConnectionId: number): Promise<UserBankConnection> {
    this.logger.debug(`Updating bankConnection ${bankConnectionId}`)
    const bankConnection = await this.getOne(bankConnectionId)
    try {
      const requisition = await this.nordigenService.getRequisition(
        bankConnection.requisition_data.id,
      )
      bankConnection.requisition_data = requisition
      bankConnection.requisition_status = STATUS_MAP[requisition.status]
      // todo check if this is in right place does it actually get renewed here or just checked?
    } catch (error) {
      this.logger.error(`Error fetching requisition for bankConnection ${bankConnectionId}`)
      bankConnection.requisition_status = RequisitionStatus.BROKEN
    }

    if (bankConnection.requisition_status === RequisitionStatus.VALID) {
      const accountsDetails: AccountDetails[] = []
      for (const account of bankConnection.requisition_data.accounts) {
        const res = await this.nordigenService.getAccountDetails(account)
        accountsDetails.push({ ...res, nordigenId: account })
      }
      bankConnection.account_details_data = accountsDetails
    }
    this.bankConnectionRepo.save(bankConnection)
    return bankConnection
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async updateBankConnections() {
    const allBankConnections = await this.find({
      where: { requisition_status: RequisitionStatus.VALID },
    })

    for (const connection of allBankConnections) {
      this.update(connection.id)
    }
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async pruneStaleBankConnections() {
    const staleBankConnections = await this.find({
      where: { requisition_status: Not(RequisitionStatus.VALID), deleted_at: IsNull() },
    })

    for (const connection of staleBankConnections) {
      if (differenceInHours(new Date(), connection.updated_at) > 24) {
        this.bankConnectionRepo.softDelete(connection)
      }
    }
  }

  async delete({ bankConnectionId, userId }: { bankConnectionId: number; userId: number }) {
    const exists = await this.bankConnectionRepo.findOne({
      where: { id: bankConnectionId, user_id: userId },
    })

    if (!exists) {
      throw new NotFoundException()
    }
    this.logger.debug(`Soft deleting bankconnection ${bankConnectionId}`)
    await this.bankConnectionRepo.softDelete(bankConnectionId)
  }

  // ----
  // Accounts
  async getActiveAccounts(userId: number) {
    const bankConnections = await this.list(userId)
    return bankConnections.reduce<string[]>(
      (acc, connection) => acc.concat(connection.requisition_data.accounts),
      [],
    )
  }
}
