import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { randomUUID } from 'crypto'
import { RequisitionStatus, UserBankConnection } from '../entities/UserBankConnection'
import { UsersService } from '../users/users.service'
import { FindManyOptions, Repository } from 'typeorm'
import { DEFAULT_REQUISITION_VALIDITY, NordigenService } from './nordigen.service'
import { AccountDetails } from './models/AccountDetails'
import { addDays } from 'date-fns'
import { BanksService } from './banks.service'

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

@Injectable()
export class BankConnectionsService {
  private readonly logger = new Logger(BankConnectionsService.name)

  constructor(
    @InjectRepository(UserBankConnection)
    private bankConnectionRepo: Repository<UserBankConnection>,
    private banksService: BanksService,
    private usersService: UsersService,
    private nordigenService: NordigenService,
  ) {}

  async list(userId: number): Promise<UserBankConnection[]> {
    const user = this.usersService.findOne({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException('No user with that id found')
    }

    const bankConnections = await this.bankConnectionRepo.find({
      where: { user_id: userId },
      relations: ['bank'],
    })
    return bankConnections
  }

  async find(options: FindManyOptions<UserBankConnection>) {
    return this.bankConnectionRepo.find(options)
  }

  async getOne(id: number): Promise<UserBankConnection> {
    const res = await this.bankConnectionRepo.findOne({ where: { id }, relations: ['bank'] })

    if (!res) {
      throw new NotFoundException(`No account with id ${id}`)
    }

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
    bankConnection.bank_id = institutionId

    await this.bankConnectionRepo.save(bankConnection)

    return bankConnection
  }

  async update(bankConnectionId: number): Promise<UserBankConnection> {
    this.logger.debug(`Updating bankConnection ${bankConnectionId}`)

    const bankConnection = await this.getOne(bankConnectionId)
    this.logger.debug(JSON.stringify(bankConnection, null, 2))

    try {
      const requisition = await this.nordigenService.getRequisition(
        bankConnection.requisition_data.id,
      )
      bankConnection.requisition_data = requisition
      bankConnection.requisition_status = STATUS_MAP[requisition.status]
      bankConnection.requisition_expires_at = addDays(new Date(), DEFAULT_REQUISITION_VALIDITY)
    } catch (error) {
      bankConnection.requisition_data = null
      bankConnection.requisition_expires_at = null
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
      this.logger.debug(JSON.stringify(bankConnection, null, 2))
    } else {
      bankConnection.account_details_data = null
    }
    this.bankConnectionRepo.save(bankConnection)
    return bankConnection
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

// storing: saving uniqueness
// on ln created
