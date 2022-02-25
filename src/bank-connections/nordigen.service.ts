import { Injectable, Logger } from '@nestjs/common'
import axios, { AxiosError } from 'axios'
import { format, formatISO } from 'date-fns'
import { Bank } from './models/bank'
import { AccountDetails } from './models/AccountDetails'
import { GetTransactionsResponse } from './models/getTransactionsResponse'
import { SupportedBank } from './constants'
import { readFile, readFileSync } from 'fs'
import mockTransactions from './mockTransactions3.json'

interface AuthTokenData {
  access: string
  access_expires: number
  refresh: string
  refresh_expires: number
}

let authToken: AuthTokenData

export interface Requisition {
  id: string
  redirect: string
  status: 'CR' | 'EX' | 'GA' | 'GC' | 'LN' | 'RJ' | 'SA' | 'SU' | 'UA'
  created: string
  agreement: string
  institution_id: SupportedBank
  accounts: string[]
  reference: string
  user_language: string
  link: string
}

export interface DateFilter {
  dateFrom?: Date
  dateTo?: Date
}

export interface AgreementsResponseDto {
  id: string
  created: string
  max_historical_days: number
  access_valid_for_days: number
  access_scope: string[]
  accepted: string
  institution_id: string
}

export const DEFAULT_REQUISITION_PERIOD = 90
export const DEFAULT_REQUISITION_VALIDITY = 90

@Injectable()
export class NordigenService {
  private readonly logger = new Logger(NordigenService.name)

  private baseUrl = `https://ob.nordigen.com/api/v2`
  private headers: { [key: string]: string } = {
    accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'Nordigen-Node-v2',
  }
  private secretKey: string = process.env.NORDIGEN_KEY
  private secretId: string = process.env.NORDIGEN_ID
  private _token?: string

  constructor() {}

  // ----
  // Token
  private set token(token: string) {
    this._token = token
    this.headers['Authorization'] = `Bearer ${token}`
  }

  private get token() {
    return this._token
  }

  async generateToken() {
    if (this.token) {
      return
    }

    const payload = {
      secret_key: this.secretKey,
      secret_id: this.secretId,
    }

    const response = await this.postRequest<AuthTokenData>(`token/new`, payload)
    this.token = response.data.access
    return response
  }

  // -----
  // Generic requests
  public async postRequest<T>(endpoint: string, data: Object) {
    const url = new URL(`${this.baseUrl}/${endpoint}/`)

    try {
      const response = await axios.post<T>(url.toString(), data, {
        headers: this.headers,
      })
      return response
    } catch (error) {
      this.handleAxiosError(error)
      throw error
    }
  }

  public async getRequest<T>(endpoint: string, params?: Record<string, string>) {
    const url = new URL(`${this.baseUrl}/${endpoint}/`)

    if (params) {
      url.search = new URLSearchParams(params).toString()
    }

    try {
      const response = await axios.get<T>(url.toString(), {
        headers: this.headers,
      })
      return response
    } catch (error) {
      this.handleAxiosError(error)
      throw error
    }
  }

  handleAxiosError(error: AxiosError) {
    this.logger.error(`Nordigen API Error`)
    if (error.response) {
      this.logger.error(`Status: ${error.response.status}`)
      this.logger.error(error.response.config.url)
      this.logger.error(error.response.data)
    }
  }

  // ----
  // Banks
  async listBanks(country = 'nl') {
    await this.generateToken()

    const endpoint = 'institutions'
    const res = await this.getRequest<Bank[]>(endpoint, { country })
    return res.data
  }

  // ----
  // Requisition
  async createRequisition({
    redirectUrl,
    institutionId,
    agreement,
    userLanguage = 'nl',
    reference,
  }: {
    redirectUrl: string
    institutionId: string
    agreement?: string
    userLanguage?: string
    reference?: string
  }) {
    await this.generateToken()

    const payload = {
      redirect: redirectUrl,
      reference: reference,
      institution_id: institutionId,
      user_language: userLanguage,
      ...(agreement && { agreement: agreement }),
    }

    const res = await this.postRequest<Requisition>('requisitions', payload)
    return res.data
  }

  async getRequisition(requisitionId: string): Promise<Requisition> {
    await this.generateToken()

    const res = await this.getRequest<Requisition>(`requisitions/${requisitionId}`)

    return res.data
  }

  async createAgreement({
    institutionId,
    maxHistoricalDays = DEFAULT_REQUISITION_PERIOD,
    accessValidForDays = DEFAULT_REQUISITION_VALIDITY,
    accessScope = ['details', 'transactions'],
  }: {
    institutionId: string
    maxHistoricalDays?: number
    accessValidForDays?: number
    accessScope?: string[]
  }) {
    await this.generateToken()

    const payload = {
      institution_id: institutionId,
      max_historical_days: maxHistoricalDays,
      access_valid_for_days: accessValidForDays,
      access_scope: accessScope,
    }

    const res = await this.postRequest<AgreementsResponseDto>(`agreements/enduser`, payload)

    return res.data
  }

  // ----
  // Transactions
  async getAccountTransactions(
    accountId: string,
    dateFilter?: DateFilter,
  ): Promise<GetTransactionsResponse['transactions']> {
    await this.generateToken()

    const queryParams: Record<string, string> = {}

    if (dateFilter.dateFrom) {
      queryParams.date_from = formatISO(dateFilter.dateFrom, { representation: 'date' })
    }
    if (dateFilter.dateTo) {
      queryParams.date_to = formatISO(dateFilter.dateTo, { representation: 'date' })
    }

    const res = await this.getRequest<GetTransactionsResponse>(
      `accounts/premium/${accountId}/transactions`,
      queryParams,
    )
    return res.data.transactions
  }

  async mockGetAccountTransactions(
    accountId: string,
    dateFilter?: DateFilter,
  ): Promise<GetTransactionsResponse['transactions']> {
    const res = mockTransactions as unknown
    return (res as GetTransactionsResponse).transactions
  }

  // -----
  // Get account details
  async getAccountDetails(accountId: string): Promise<Omit<AccountDetails, 'nordigenId'>> {
    await this.generateToken()

    const res = await this.getRequest<{
      account: Omit<AccountDetails, 'nordigenId'>
    }>(`accounts/${accountId}/details`)
    return res.data.account
  }
}
