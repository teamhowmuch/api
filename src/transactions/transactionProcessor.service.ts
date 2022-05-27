import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'

import { Transaction as TransactionEntity } from '../entities/Transaction'
import { TransactionsService } from './transactions.service'
import { TransactionCategory, KnownMerchant } from './categories'
import { SourceType } from '../entities/EmissionEvent'
import { UsersService } from '../users/users.service'
import { CarfuelService } from '../products/carfuel/carfuel.service'
import { EmissionEventsService } from '../emission-events/emission-events.service'
import { Transaction } from '../bank-connections/models/transaction'
import { CarsService } from '../cars/cars.service'
import { extractMerchant } from './extractMerchant'
import { CleanedTransaction } from './clean'

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

  async process(
    entity: TransactionEntity,
    rawTransaction: Transaction,
    cleanedTransaction: CleanedTransaction,
  ) {
    if (entity.processed_at) {
      return
    }

    const merchant = extractMerchant(cleanedTransaction)

    if (merchant) {
      if (merchant.category === TransactionCategory.CARFUEL) {
        await this.processCarfuelTransaction(entity, rawTransaction, cleanedTransaction, merchant)
      }
    }
  }

  private async processCarfuelTransaction(
    entity: TransactionEntity,
    rawTransaction: Transaction,
    cleanedTransaction: CleanedTransaction,
    merchant: KnownMerchant,
  ) {
    const amount = Math.abs(cleanedTransaction.amount)
    const cars = await this.carsService.list(entity.user_id)
    const userCarFuelType = cars[0]?.fuel_type_simplified

    if (userCarFuelType) {
      const liters = await this.carfuelService.getFuelAmount(
        cleanedTransaction.bookingDate,
        amount,
        userCarFuelType,
      )
      const price = await this.carfuelService.getFuelPricePerLiter(
        cleanedTransaction.bookingDate,
        userCarFuelType,
      )

      const co2eq_mean = await this.carfuelService.calculateFuelEmissions(userCarFuelType, liters)

      const data = {
        transaction_type: TransactionCategory.CARFUEL,
        transaction_amount: amount,
        carfuel_type: userCarFuelType,
        carfuel_amount: liters,
        carfuel_price: price,
        merchant,
      }

      await this.emissionEventService.create(
        entity.user_id,
        co2eq_mean,
        SourceType.TRANSACTION,
        entity.id,
        cleanedTransaction.bookingDate,
        data,
      )

      entity.processed_at = new Date()
      await this.transactionsService.updateTransaction(entity)
      return true
    }
  }
}
