import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Bank } from '../entities/Bank'
import { FindOneOptions, Repository } from 'typeorm'
import { NordigenService } from './nordigen.service'
import { Cron, CronExpression } from '@nestjs/schedule'
import { SUPPORTED_BANKS } from './constants'

@Injectable()
export class BanksService {
  private readonly logger = new Logger(BanksService.name)

  constructor(
    private nordigenService: NordigenService,
    @InjectRepository(Bank) private bankRepository: Repository<Bank>,
  ) {}

  async list() {
    return this.bankRepository.find()
  }

  async findOne(options: FindOneOptions<Bank>) {
    return this.bankRepository.findOne(options)
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async updateAvailableBanks() {
    try {
      this.logger.log('Importing bank connections...')

      await this.nordigenService.generateToken()
      const providerBanks = await this.nordigenService.listBanks()

      for (const bank of providerBanks) {
        if ((SUPPORTED_BANKS as Readonly<string[]>).includes(bank.id)) {
          const entity = new Bank()
          entity.id = bank.id
          entity.transaction_total_days = parseInt(bank.transaction_total_days)
          entity.logo = bank.logo
          entity.bic = bank.bic
          entity.name = bank.name
          entity.provider = 'nordigen'
          await this.bankRepository.save(entity)
          this.logger.log(`Imported ${entity.name}`)
        }
      }

      if (process.env.NODE_ENV === 'development') {
        const entity = new Bank()
        entity.id = 'SANDBOXFINANCE_SFIN0000'
        entity.transaction_total_days = 90
        entity.logo =
          'https://img.stackshare.io/service/25455/default_bc1c86d37cbc37bd50b2b76e446121db77f9b3c4.png'
        entity.bic = 'SANDBOX_BIC'
        entity.name = 'Nordigen Sandbox'
        entity.provider = 'nordigen'
        await this.bankRepository.save(entity)
        this.logger.log(`Imported ${entity.name}`)
      }

      const entity = new Bank()
      entity.id = 'nl_bunq_oauth2'
      entity.transaction_total_days = 365
      entity.logo =
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Bunq_%28bank%29_company_logo_2017.svg/2048px-Bunq_%28bank%29_company_logo_2017.svg.png'
      entity.bic = 'BUNQNL2AXXX'
      entity.name = 'bunq'
      entity.provider = 'tink'
      await this.bankRepository.save(entity)
    } catch (error) {
      this.logger.error('Error importing banks')
      this.logger.error(error)
    }
  }
}
