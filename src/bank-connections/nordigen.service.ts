import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError, Method as HttpMethod } from 'axios';

interface AuthTokenData {
  access: string;
  access_expires: number;
  refresh: string;
  refresh_expires: number;
}

let authToken: AuthTokenData;

interface NordigenKeys {
  secretKey: string;
  secretId: string;
}

export interface Requisition {
  id: string;
  redirect: string;
  status: 'CR' | 'EX' | 'GA' | 'GC' | 'LN' | 'RJ' | 'SA' | 'SU' | 'UA';
  created: string;
  agreement: string;
  accounts: string[];
  reference: string;
  user_language: string;
  link: string;
}

export interface AgreementsResponseDto {
  id: string;
  created: string;
  max_historical_days: number;
  access_valid_for_days: number;
  access_scope: string[];
  accepted: string;
  institution_id: string;
}

export interface Bank {
  id: string;
  name: string;
  bic: string;
  transaction_total_days: string;
  countries: string[];
  logo: string;
}

@Injectable()
export class NordigenService {
  private readonly logger = new Logger(NordigenService.name);

  private baseUrl = `https://ob.nordigen.com/api/v2`;
  private headers: { [key: string]: string } = {
    accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'Nordigen-Node-v2',
  };
  private secretKey: string = process.env.NORDIGEN_KEY;
  private secretId: string = process.env.NORDIGEN_ID;
  private _token?: string;

  // this.agreement = new AgreementApi({ client: this });
  // this.requisition = new RequisitionsApi({ client: this });

  constructor() {}

  private set token(token: string) {
    this._token = token;
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  private get token() {
    return this._token;
  }

  public async postRequest<T>(endpoint: string, data: Object) {
    const url = new URL(`${this.baseUrl}/${endpoint}/`);

    try {
      const response = await axios.post<T>(url.toString(), data, {
        headers: this.headers,
      });
      return response;
    } catch (error) {
      this.handleAxiosError(error);
      throw error;
    }
  }

  public async getRequest<T>(
    endpoint: string,
    params?: Record<string, string>,
  ) {
    const url = new URL(`${this.baseUrl}/${endpoint}/`);

    if (params) {
      url.search = new URLSearchParams(params).toString();
    }

    try {
      const response = await axios.get<T>(url.toString(), {
        headers: this.headers,
      });
      return response;
    } catch (error) {
      this.handleAxiosError(error);
      throw error;
    }
  }

  handleAxiosError(error: AxiosError) {
    this.logger.error(`Nordigen API Error`);
    if (error.response) {
      this.logger.error(`Status: ${error.response.status}`);
      this.logger.error(error.response.config.url);
      this.logger.error(error.response.data);
    }
  }

  async generateToken() {
    if (this.token) {
      return;
    }

    const payload = {
      secret_key: this.secretKey,
      secret_id: this.secretId,
    };

    const response = await this.postRequest<AuthTokenData>(
      `token/new`,
      payload,
    );
    this.token = response.data.access;
    return response;
  }

  async listBanks(country = 'nl') {
    const endpoint = 'institutions';
    const res = await this.getRequest<Bank[]>(endpoint, { country });
    return res.data;
  }

  async createRequisition({
    redirectUrl,
    institutionId,
    agreement,
    userLanguage = 'nl',
    reference,
  }: {
    redirectUrl: string;
    institutionId: string;
    agreement?: string;
    userLanguage?: string;
    reference?: string;
  }) {
    const payload = {
      redirect: redirectUrl,
      reference: reference,
      institution_id: institutionId,
      user_language: userLanguage,
      ...(agreement && { agreement: agreement }),
    };

    const res = await this.postRequest<Requisition>('requisitions', payload);
    return res.data;
  }

  async getRequisition(requisitionId: string): Promise<Requisition> {
    await this.generateToken();

    const res = await this.getRequest<Requisition>(
      `requisitions/${requisitionId}`,
    );

    return res.data;
  }

  async createAgreement({
    institutionId,
    maxHistoricalDays = 90,
    accessValidForDays = 90,
    accessScope = ['balances', 'details', 'transactions'],
  }: {
    institutionId: string;
    maxHistoricalDays?: number;
    accessValidForDays?: number;
    accessScope?: string[];
  }) {
    await this.generateToken();

    const payload = {
      institution_id: institutionId,
      max_historical_days: maxHistoricalDays,
      access_valid_for_days: accessValidForDays,
      access_scope: accessScope,
    };

    const res = await this.postRequest<AgreementsResponseDto>(
      `agreements/enduser`,
      payload,
    );

    return res.data;
  }

  async getAccountTransactions(
    accountId: string,
  ): Promise<GetTransactionsResponse['transactions']> {
    await this.generateToken();

    const res = await this.getRequest<GetTransactionsResponse>(
      `accounts/${accountId}/transactions`,
    );
    return res.data.transactions;
  }
}

export interface Transaction {
  transactionId: string;
  transactionAmount: {
    currency: string;
    amount: number;
  };
  bankTransactionCode: string;
  bookingDate: Date;
  valueDate: Date;
  remittanceInformationUnstructured: string;
}

export interface GetTransactionsResponse {
  transactions: {
    booked: Transaction[];
    pending: Partial<Transaction>[];
  };
}
