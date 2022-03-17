import { transaction, TransactionData } from '../queues'
import { InjectQueue, OnQueueError, Process, Processor } from '@nestjs/bull'
import { Job, Queue } from 'bull'
import { CleanService } from './clean.service'
import { Transaction as TransactionEntity } from 'src/entities/Transaction'
import { TransactionsService } from './transactions.service'
import { Logger } from '@nestjs/common'
import hasher from 'node-object-hash'
import { debtorCategoryMap, TransactionCategory } from './categories'
import { SourceType } from 'src/entities/EmissionEvent'
import { UsersService } from 'src/users/users.service'
import { CarfuelService, FuelType } from 'src/products/carfuel/carfuel.service'
import { EmissionEventsService } from 'src/emission-events/emission-events.service'

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

@Processor(transaction)
export class TransactionProcessor {
  private readonly logger = new Logger(TransactionProcessor.name)
  constructor(
    @InjectQueue(transaction)
    private queue: Queue,

    private cleanService: CleanService,
    private transactionsService: TransactionsService,
    private usersService: UsersService,
    private carfuelService: CarfuelService,
    private emissionEventService: EmissionEventsService,
  ) {}

  @OnQueueError()
  async onError(error: Error) {
    this.logger.error('Error in transaction queue')
    this.logger.error(error)
  }

  @Process()
  async transaction(job: Job<TransactionData>) {
    const {
      data: { bankConnection, transaction, account },
    } = job
    try {
      const id = transaction.transactionId || transaction.endToEndId || hash.hash(transaction)
      this.logger.debug(`Processing transaction with id ${id}`)
      let transactionEntity = await this.transactionsService.findOne({ where: { id } })
      this.logger.debug('A')
      if (transactionEntity && transactionEntity.processed) {
        console.log(transactionEntity)
        // Transaction has been processed already
        return
      }
      this.logger.debug('B')

      const existingEmissionEvent = await this.emissionEventService.findOne({
        where: { source_type: SourceType.TRANSACTION, source_id: id },
      })
      if (existingEmissionEvent) {
        console.log(existingEmissionEvent)
        // Emission Event for this transaction already exists
        return
      }
      this.logger.debug('C')
      // Save transaction proof of processing
      transactionEntity = new TransactionEntity()
      transactionEntity.id = id
      transactionEntity.userId = bankConnection.userId
      transactionEntity.processed = false
      transactionEntity.bankConnectionId = bankConnection.id
      transactionEntity = await this.transactionsService.saveTransaction(transactionEntity)
      this.logger.debug('D')

      const transactionCategory = creditorNameToCategory(transaction.creditorName)
      this.logger.debug(`transaction category ${transactionCategory}`)

      // It's carfuelTime, process
      if (transactionCategory === TransactionCategory.CARFUEL) {
        this.logger.debug('D1')

        const user = await this.usersService.findOne({ id: bankConnection.userId })
        const userCarFuelType = user.car_fuel_type
        console.log(user)
        if (user.car_fuel_type) {
          this.logger.debug('D2')

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
            carfuel_type: user.car_fuel_type,
            carfuel_amount: liters,
            carfuel_price: price,
            vendor: 'Shell',
            vendor_icon: 'https://itanks.eu/app/uploads/2018/07/Shell-logo.png',
          }

          this.logger.debug('E')

          await this.emissionEventService.create(
            user.id,
            co2eq_mean,
            SourceType.TRANSACTION,
            id,
            transactionDate,
            data,
          )
          this.logger.debug('F')

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
