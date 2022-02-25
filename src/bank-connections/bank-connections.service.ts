import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { randomUUID } from 'crypto'
import { RequisitionStatus, UserBankConnection } from 'src/entity/UserBankConnection'
import { UsersService } from 'src/users/users.service'
import { Repository } from 'typeorm'
import { DEFAULT_REQUISITION_VALIDITY, NordigenService } from './nordigen.service'
import { Bank } from './models/bank'
import { AccountDetails } from './models/AccountDetails'
import { addDays } from 'date-fns'

const NORDIGEN_REDIR_URL = 'exp://192.168.178.20:19000'

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
    private usersService: UsersService,
    private nordigenService: NordigenService,
  ) {}

  // ----
  // Banks
  async getBanks(): Promise<Bank[]> {
    await this.nordigenService.generateToken()
    const res = await this.nordigenService.listBanks()
    return res
  }

  async getBank(bankId: string) {
    const banks = await this.getBanks()
    const bank = banks.find((el) => el.id === bankId)
    if (!bank) {
      throw new Error(`Bank not found ${bankId}`)
    }
    return bank
  }

  // ----
  // User bank connections
  async listBankConnections(userId: number): Promise<UserBankConnection[]> {
    const user = this.usersService.findOne({ id: userId })
    const bankConnections = await this.bankConnectionRepo.find({
      where: user,
      loadRelationIds: true,
    })
    return bankConnections
  }

  async getBankConnection(id: number): Promise<UserBankConnection> {
    const res = await this.bankConnectionRepo.findOne({ where: { id } })

    if (!res) {
      throw new NotFoundException(`No account with id ${id}`)
    }

    return res
  }

  async create(
    institutionId: string,
    transactionDaysTotal: number,
    userId: number,
  ): Promise<UserBankConnection> {
    const user = await this.usersService.findOne({ id: userId })
    const bankConnection = new UserBankConnection()
    bankConnection.user = user

    const redirectUrl = NORDIGEN_REDIR_URL
    const reference = randomUUID()

    const agreement = await this.nordigenService.createAgreement({
      institutionId,
      maxHistoricalDays: Math.min(transactionDaysTotal, 365)
    })

    const requisition = await this.nordigenService.createRequisition({
      redirectUrl,
      institutionId,
      reference,
      agreement: agreement.id,
    })

    bankConnection.requisition_data = requisition

    await this.bankConnectionRepo.save(bankConnection)

    return bankConnection
  }

  async update(bankConnectionId: number): Promise<UserBankConnection> {
    this.logger.debug(`Updating bankConnection ${bankConnectionId}`)

    const bankConnection = await this.getBankConnection(bankConnectionId)
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
    const bankConnections = await this.listBankConnections(userId)
    return bankConnections.reduce<string[]>(
      (acc, connection) => acc.concat(connection.requisition_data.accounts),
      [],
    )
  }
}

// storing: saving uniqueness
// on ln created
