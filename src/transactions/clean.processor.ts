import {
  categoriseTransaction,
  CategoriseTransactionData,
  cleanTransaction,
  CleanTransactionData,
} from '../queues'
import { InjectQueue, OnQueueActive, Process, Processor } from '@nestjs/bull'
import { Transaction } from '../bank-connections/models/transaction'
import { Job, Queue } from 'bull'
import { CleanService } from './clean.service'
import { AccountDetails } from 'src/bank-connections/models/AccountDetails'
import { Transaction as TransactionEntity } from 'src/entities/Transaction'
import { randomUUID } from 'crypto'
import { TransactionsService } from './transactions.service'
import { Logger } from '@nestjs/common'
import { SupportedBank } from 'src/bank-connections/constants'
import hasher from 'node-object-hash'

const hash = hasher({ sort: true, coerce: true })

@Processor(cleanTransaction)
export class StructureProcessor {
  private readonly logger = new Logger(StructureProcessor.name)
  constructor(
    @InjectQueue(cleanTransaction)
    private cleanQueue: Queue,
    @InjectQueue(categoriseTransaction)
    private categoriseQueue: Queue<CategoriseTransactionData>,
    private cleanService: CleanService,
    private transactionsService: TransactionsService,
  ) {}

  @Process()
  async clean(job: Job<CleanTransactionData>) {
    const {
      data: { bankConnection, transaction, account },
    } = job

    try {
      const entity = new TransactionEntity()
      entity.id = transaction.transactionId || transaction.endToEndId || hash.hash(transaction)
      entity.bank_data = transaction
      entity.bankConnection = bankConnection
      entity.userId = bankConnection.user.id
      console.log(entity.user, entity.userId)
      await this.transactionsService.saveTransaction(entity)
      this.categoriseQueue.add({ entity, account, bankConnection, transaction })
    } catch (error) {
      this.logger.error(`error cleaning transaction ${transaction}`)
      this.logger.error(error)
    }
    // mapFns[bankConnection.requisition_data.]
  }

  // @OnQueueActive()
  // async onActive(job: Job<Transaction>) {
  //   const counts = await this.cleanQueue.getJobCounts()
  //   console.log(`${this.cleanQueue.name} queue active. ${JSON.stringify(counts)}`)
  // }
}
