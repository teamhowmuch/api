import { categoriseTransaction, CategoriseTransactionData } from '../queues'
import { Process, Processor } from '@nestjs/bull'

import { Job } from 'bull'
import { Transaction as TransactionEntity } from 'src/entity/Transaction'

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
  constructor(private transactionsService: TransactionsService) {}

  @Process()
  async categorise(job: Job<CategoriseTransactionData>) {
    const {
      data: { transaction, entity },
    } = job
    const category = creditorNameToCategory(transaction.creditorName)
    entity.category = category
    entity.categorized_at = new Date()
    this.logger.debug(
      `Category ${category.padEnd(15)} from ${transaction.creditorName}`,
    )
    await this.transactionsService.saveTransaction(entity)
  }
}
