import { Transaction as TransactionEntity } from 'src/entities/Transaction'
import { TransactionsService } from './transactions.service'
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import hasher from 'node-object-hash'
import { knownMerchants, KnownMerchant, TransactionCategory } from './categories'
import { SourceType } from 'src/entities/EmissionEvent'
import { UsersService } from 'src/users/users.service'
import { CarfuelService } from 'src/products/carfuel/carfuel.service'
import { EmissionEventsService } from 'src/emission-events/emission-events.service'
import { Transaction } from 'src/bank-connections/models/transaction'
import { UserBankConnection } from 'src/entities/UserBankConnection'
import { AccountDetails } from 'src/bank-connections/models/AccountDetails'
import { CarsService } from 'src/cars/cars.service'
import { TransactionAnonymized } from 'src/entities/TransactionAnonymized'

const hash = hasher({ sort: true, coerce: true })

function extractMerchant(transaction: Transaction): KnownMerchant | null {
  if (!transaction.creditorName) {
    console.warn(
      'unknown transaction creditor / unreadable format at transaction, JSON.stringify(transaction)',
    )
    return null
  }
  const { creditorName } = transaction
  const creditorNameLower = creditorName.toLowerCase()

  for (const merchant of knownMerchants) {
    if (creditorNameLower.includes(merchant.searchPattern)) {
      console.log('Analysed merchantName', creditorNameLower, 'resolved to', merchant)
      return merchant
    }
  }
  console.log('Analysed merchantName', creditorNameLower, 'resolved to nothing')
  return null
}

@Injectable()
export class TransactionProcessor {
  private readonly logger = new Logger(TransactionProcessor.name)

  constructor(
    private usersService: UsersService,
    private carfuelService: CarfuelService,
    private carsService: CarsService,
    @Inject(forwardRef(() => TransactionsService))
    private transactionsService: TransactionsService,
    private emissionEventService: EmissionEventsService,
  ) {}

  async process({
    bankConnection,
    transaction,
  }: {
    bankConnection: UserBankConnection
    transaction: Transaction
    account: AccountDetails
  }) {
    try {
      const id = transaction.transactionId || transaction.endToEndId || hash.hash(transaction)
      const userId = bankConnection.user_id
      const user = await this.usersService.findOne({ where: { id: userId } })

      let transactionEntity = await this.transactionsService.findOne({
        where: { id, user_id: userId },
      })

      if (transactionEntity && transactionEntity.processed) {
        return
      }

      let anonymizedTransaction
      console.log('is user beta tester?', user.is_beta_tester)
      if (user.is_beta_tester) {
        console.log(user.is_beta_tester)
        anonymizedTransaction = new TransactionAnonymized()
        anonymizedTransaction.raw_data = transaction
        await this.transactionsService.saveAnonymizedTransaction(anonymizedTransaction)
      }

      // Save transaction proof of processing
      transactionEntity = new TransactionEntity()
      transactionEntity.id = id
      transactionEntity.user_id = userId
      transactionEntity.processed = false
      transactionEntity.bank_connection_id = bankConnection.id
      transactionEntity = await this.transactionsService.saveTransaction(transactionEntity)

      const merchant = extractMerchant(transaction)

      // It's carfuelTime, process
      if (merchant) {
        if (user.is_beta_tester) {
          anonymizedTransaction.resolved_to = { ...anonymizedTransaction.resolved_to, merchant }
          await this.transactionsService.saveAnonymizedTransaction(anonymizedTransaction)
        }

        if (merchant.category === TransactionCategory.CARFUEL) {
          const user = await this.usersService.findOne({ where: { id: userId } })
          const cars = await this.carsService.list(userId)
          const userCarFuelType = cars[0]?.fuel_type_simplified

          if (userCarFuelType) {
            const transactionDate = new Date(transaction.bookingDate)
            const amount = Math.abs(transaction.transactionAmount.amount)

            const liters = await this.carfuelService.getFuelAmount(
              transactionDate,
              amount,
              userCarFuelType,
            )
            const price = await this.carfuelService.getFuelPricePerLiter(
              transactionDate,
              userCarFuelType,
            )
            const co2eq_mean = await this.carfuelService.calculateFuelEmissions(
              userCarFuelType,
              liters,
            )

            const data = {
              transaction_type: TransactionCategory.CARFUEL,
              transaction_amount: amount,
              carfuel_type: userCarFuelType,
              carfuel_amount: liters,
              carfuel_price: price,
              merchant,
            }

            const emissionEvent = await this.emissionEventService.create(
              user.id,
              co2eq_mean,
              SourceType.TRANSACTION,
              id,
              transactionDate,
              data,
            )

            transactionEntity.processed = false
            await this.transactionsService.saveTransaction(transactionEntity)

            if (user.is_beta_tester) {
              anonymizedTransaction.resolved_to = {
                ...anonymizedTransaction.resolved_to,
                emissionEvent,
              }
              await this.transactionsService.saveAnonymizedTransaction(anonymizedTransaction)
            }

            return true
          }
        }
      }
    } catch (error) {
      this.logger.error('Error processing transaction')
      this.logger.error(error)
      throw error
    }
  }
}
