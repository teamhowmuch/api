import { purchasesFromTransactions, PurchasesFromTransactionsData } from '../queues'
import { OnQueueActive, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'

import { Job } from 'bull'
import { TransactionCategory } from 'src/transactions/categories'
import { ConfirmationService } from 'src/transactions/confirmation.service'
import { ConfirmationStatus, TransactionConfirmation } from 'src/entities/TransactionConfirmation'

@Processor(purchasesFromTransactions)
export class FromTransactionsProcessor {
  private readonly logger = new Logger(FromTransactionsProcessor.name)

  constructor(private confirmationService: ConfirmationService) {}

  @Process(TransactionCategory.CARFUEL)
  async carfuel(job: Job<PurchasesFromTransactionsData>) {
    const {
      data: { transaction },
    } = job

    // Is this transaction confirmed?
    const confirmation = await this.confirmationService.getByTransactionId(transaction.id)

    if (confirmation) {
      const { data } = confirmation
    } else {
    }
    // const estimatedLiters
  }

  @Process(TransactionCategory.GROCERIES)
  async groceries(job: Job<PurchasesFromTransactionsData>) {
    const {
      data: { transaction },
    } = job

    console.log('')
    console.log('')
    console.log('analysing transaction')
    console.log(transaction)
    // Do we have a prior confirmation
    console.log('checking for confirmation...')

    try {
      const confirmation = await this.confirmationService.getByTransactionId(transaction.id)

      if (!confirmation) {
        console.log('no confirmation')
        console.log('finding priors')
        const prior = await this.confirmationService.findLatestConfirmedInCategory(
          transaction.bankConnection.userId,
          transaction.category,
        )

        if (prior) {
          console.log('prior')
          console.log(prior)
          const newConfirmation = await this.confirmationService.create(
            transaction.id,
            { ...prior.data, basedOnTransaction: prior.transactionId },
            ConfirmationStatus.AUTO_CONFIRMED,
          )
        } else {
          console.log('no prior')
          const newConfirmation = await this.confirmationService.create(
            transaction.id,
            {},
            ConfirmationStatus.CONFIRMATION_NEEDED,
          )
        }
      }
    } catch (error) {
      this.logger.error(error)
    }
  }
}
