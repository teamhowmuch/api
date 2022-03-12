import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { cleanTransaction, CleanTransactionData } from '../queues'
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { BankConnectionsService } from 'src/bank-connections/bank-connections.service'
import { Transaction } from 'src/bank-connections/models/transaction'
import { DateFilter, NordigenService } from 'src/bank-connections/nordigen.service'
import { Transaction as TransactionEntity } from '../entities/Transaction'
import { Connection, FindManyOptions, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { AccountDetails } from 'src/bank-connections/models/AccountDetails'
import { UserBankConnection } from 'src/entities/UserBankConnection'
import {
  ConfirmationData,
  ConfirmationStatus,
  TransactionConfirmation,
} from 'src/entities/TransactionConfirmation'
import { string } from 'yup'
import { TransactionCategory } from './categories'

@Injectable()
export class ConfirmationService {
  private readonly logger = new Logger(ConfirmationService.name)

  constructor(
    @InjectRepository(TransactionConfirmation)
    private confirmationRepo: Repository<TransactionConfirmation>,
    @InjectRepository(TransactionEntity)
    private transactionRepo: Repository<TransactionEntity>,
  ) {}

  async getByTransactionId(transactionId: string) {
    return this.confirmationRepo.findOne({ where: { transactionId } })
  }

  async find(options: FindManyOptions<TransactionConfirmation>) {
    return this.confirmationRepo.find(options)
  }

  async findLatestConfirmedInCategory(userId: number, category: TransactionCategory) {
    try {
      const res = await this.confirmationRepo
        .createQueryBuilder('confirmation')
        .leftJoinAndSelect(
          'transaction',
          'transaction',
          'confirmation.transactionId = transaction.id',
        )
        .where('transaction.userId = :userId', { userId })
        .andWhere('transaction.category = :category', { category })
        .andWhere('confirmation.status = :status', { status: ConfirmationStatus.USER_CONFIRMED })
        .orderBy('confirmation.updated_at', 'DESC')
        .getOne()
      return res
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async search({
    userId,
    category,
    status,
    page = 0,
  }: {
    userId: number
    category?: TransactionCategory
    status?: ConfirmationStatus
    page?: number
  }) {
    try {
      let query = this.confirmationRepo
        .createQueryBuilder('confirmation')
        .leftJoinAndSelect(
          'transaction',
          'transaction',
          'confirmation.transactionId = transaction.id',
        )
        .where('transaction.userId = :userId', { userId })

      if (category) {
        query = query.andWhere('transaction.category = :category', { category })
      }

      if (status) {
        query = query.andWhere('confirmation.status = :status', { status })
      }

      query = query
        .orderBy('confirmation.updated_at', 'DESC')
        .limit(25)
        .offset(page * 25)

      console.log(query.getQueryAndParameters())

      const res = query.getMany()
      return res
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async create(
    transactionId: string,
    data: ConfirmationData,
    status: ConfirmationStatus,
  ): Promise<TransactionConfirmation> {
    const confirmation = new TransactionConfirmation()
    confirmation.transactionId = transactionId
    confirmation.status = status
    confirmation.data = data
    return this.confirmationRepo.save(confirmation)
  }

  // async update()
}
