import { Transaction as TransactionEntity } from 'src/entities/Transaction'
import { TransactionsService } from './transactions.service'
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import hasher from 'node-object-hash'
import { debtorCategoryMap, TransactionCategory } from './categories'
import { SourceType } from 'src/entities/EmissionEvent'
import { UsersService } from 'src/users/users.service'
import { CarfuelService } from 'src/products/carfuel/carfuel.service'
import { EmissionEventsService } from 'src/emission-events/emission-events.service'
import { Transaction } from 'src/bank-connections/models/transaction'
import { UserBankConnection } from 'src/entities/UserBankConnection'
import { AccountDetails } from 'src/bank-connections/models/AccountDetails'
import { CarsService } from 'src/cars/cars.service'

const hash = hasher({ sort: true, coerce: true })

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
      let transactionEntity = await this.transactionsService.findOne({
        where: { id, user_id: userId },
      })

      if (transactionEntity && transactionEntity.processed) {
        console.log('transaction for this user already processed')
        return
      }

      // Todo this seems like a redundant check with transaction already processed
      const existingEmissionEvent = await this.emissionEventService.findOne({
        where: { source_type: SourceType.TRANSACTION, source_id: id, user_id: userId },
      })
      if (existingEmissionEvent) {
        console.log('emission event for this source already exists')
        // Emission Event for this transaction already exists
        return
      }

      // Save transaction proof of processing
      transactionEntity = new TransactionEntity()
      transactionEntity.id = id
      transactionEntity.user_id = userId
      transactionEntity.processed = false
      transactionEntity.bank_connection_id = bankConnection.id
      transactionEntity = await this.transactionsService.saveTransaction(transactionEntity)
      console.log('saved transaction with userid', userId)

      const transactionCategory = creditorNameToCategory(transaction.creditorName)

      // It's carfuelTime, process
      if (transactionCategory === TransactionCategory.CARFUEL) {
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
            vendor: 'Shell',
            vendor_icon: 'https://itanks.eu/app/uploads/2018/07/Shell-logo.png',
          }

          await this.emissionEventService.create(
            user.id,
            co2eq_mean,
            SourceType.TRANSACTION,
            id,
            transactionDate,
            data,
          )

          transactionEntity.processed = false
          await this.transactionsService.saveTransaction(transactionEntity)
          return true
          this.logger.debug('G')
        }
      }
    } catch (error) {
      this.logger.error('Error processing transaction')
      this.logger.error(error)
      throw error
    }
  }
}