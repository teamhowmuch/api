import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { User } from 'src/entity/User';
import { UserBankConnection } from 'src/entity/UserBankConnection';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Bank, Transaction, NordigenService } from './nordigen.service';

const NORDIGEN_REDIR_URL = 'exp://192.168.178.20:19000';

export interface BankConnectionDto {
  id: number;
  provider: string;
  status: 'CR' | 'EX' | 'GA' | 'GC' | 'LN' | 'RJ' | 'SA' | 'SU' | 'UA';
  accounts: string[];
  created_at: Date;
  link: string;
}

@Injectable()
export class BankConnectionsService {
  constructor(
    @InjectRepository(UserBankConnection)
    private bankConnectionRepo: Repository<UserBankConnection>,
    private usersService: UsersService,
    private nordigenService: NordigenService,
  ) {}

  async listBankConnections(userId: number) {
    const user = this.usersService.findOne({ id: userId });
    const bankConnections = await this.bankConnectionRepo.find({
      where: user,
      relations: ['user'],
    });
    return bankConnections.map((bankConnection) =>
      this.bankConnectionToDto(bankConnection),
    );
  }

  async getBankConnection(id: number): Promise<UserBankConnection> {
    const res = await this.bankConnectionRepo.findOne({ where: { id } });
    return res;
  }

  async getBanks(): Promise<Bank[]> {
    await this.nordigenService.generateToken();
    const res = await this.nordigenService.listBanks();
    return res;
  }

  async getBank(bankId: string) {
    const banks = await this.getBanks();
    const bank = banks.find((el) => el.id === bankId);
    if (!bank) {
      throw new Error(`Bank not found ${bankId}`);
    }
    return bank;
  }

  async create(
    institutionId: string,
    userId: number,
  ): Promise<BankConnectionDto> {
    const user = await this.usersService.findOne({ id: userId });
    const bankConnection = new UserBankConnection();
    bankConnection.user = user;

    const redirectUrl = NORDIGEN_REDIR_URL;
    const reference = randomUUID();

    const agreement = await this.nordigenService.createAgreement({
      institutionId,
    });

    const requisition = await this.nordigenService.createRequisition({
      redirectUrl,
      institutionId,
      reference,
      agreement: agreement.id,
    });

    bankConnection.requisition_data = requisition;

    await this.bankConnectionRepo.save(bankConnection);

    return this.bankConnectionToDto(bankConnection);
  }

  async update(bankConnectionId: number): Promise<BankConnectionDto> {
    const bankConnection = await this.getBankConnection(bankConnectionId);
    const requisition = await this.nordigenService.getRequisition(
      bankConnection.requisition_data.id,
    );

    bankConnection.requisition_data = requisition;
    this.bankConnectionRepo.save(bankConnection);
    return this.bankConnectionToDto(bankConnection);
  }

  bankConnectionToDto(bankConnection: UserBankConnection): BankConnectionDto {
    const { id, provider, created_at } = bankConnection;
    const { status, link, accounts } = bankConnection.requisition_data;

    const dto = {
      id,
      provider,
      created_at,
      status,
      link,
      accounts,
    };
    return dto;
  }

  async getTransactions(
    bankConnectionId: number,
    userId: number,
  ): Promise<Transaction[]> {
    const bankConnection = await this.bankConnectionRepo.findOne({
      where: {
        id: bankConnectionId,
        user: {
          id: userId,
        },
      },
    });

    const transactions: Transaction[] = [];
    for (const accountId of bankConnection.requisition_data.accounts) {
      const transactionsRes = await this.nordigenService.getAccountTransactions(
        accountId,
      );
      transactions.push(...transactionsRes.booked);
    }

    return transactions;
  }
}
