import {
  categoriseTransaction,
  CategoriseTransactionData,
  purchasesFromTransactions,
  PurchasesFromTransactionsData,
} from '../queues'
import { InjectQueue, Process, Processor } from '@nestjs/bull'

import { Job, Queue } from 'bull'
import { Transaction as TransactionEntity } from 'src/entities/Transaction'

import { TransactionsService } from './transactions.service'
import { Logger } from '@nestjs/common'
import { debtorCategoryMap, TransactionCategory } from './categories'

function creditorNameToCategory(creditorName: string): TransactionCategory {
  let result = TransactionCategory.OTHER
  for (const category in debtorCategoryMap) {
    if (
      debtorCategoryMap[category as TransactionCategory].some((searchElement) =>
        creditorName.toLowerCase().includes(searchElement),
      )
    ) {
      result = category as TransactionCategory
    }
  }
  return result
}

@Processor(categoriseTransaction)
export class CategoriseProcessor {
  private readonly logger = new Logger(CategoriseProcessor.name)
  constructor(
    private transactionsService: TransactionsService,
    @InjectQueue(purchasesFromTransactions)
    private purchasesQueue: Queue<PurchasesFromTransactionsData>,
  ) {}

  @Process()
  async categorise(job: Job<CategoriseTransactionData>) {
    const {
      data: { transaction, entity },
    } = job
    const category = creditorNameToCategory(transaction.creditorName)
    entity.category = category
    entity.categorized_at = new Date()
    this.logger.debug(`Category ${category.padEnd(15)} from ${transaction.creditorName}`)
    await this.transactionsService.saveTransaction(entity)
    this.purchasesQueue.add(category, { transaction: entity })
    console.log('pushed to category', category)
  }

  private async postCategorise(entity: TransactionCategory) {
    // this.
  }
}
