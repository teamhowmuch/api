import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { closestTo, differenceInHours, isAfter, parse } from 'date-fns'
import { firstValueFrom } from 'rxjs'

export enum FuelType {
  PETROL   = 'PETROL',
  DIESEL   = 'DIESEL',
  LPG      = 'LPG',
}

type FuelTypeKeys  = keyof typeof FuelType
type FuelKeyFields = {[key in FuelTypeKeys]: number}

interface FuelPriceDatum extends FuelKeyFields {
  date: Date
}

interface CbsData {
  Perioden       : string
  BenzineEuro95_1: number
  Diesel_2       : number
  Lpg_3          : number
}

// Source
// https://www.co2emissiefactoren.nl/lijst-emissiefactoren/
const CO2_EQ_PER_LITER: { [key in FuelType]: number } = {
  [FuelType.PETROL]: 2.784,
  [FuelType.DIESEL]: 3.262,
  [FuelType.LPG]   : 1.798,
}

const DATA_LOCATION             = 'https://opendata.cbs.nl/ODataApi/odata/80416ned/TypedDataSet'
const MIN_IMPORT_INTERVAL_HOURS = 8

@Injectable()
export class CarfuelService {
  private logger = new Logger(CarfuelService.name)
  private lastImport: Date
  private fuelPricesData: FuelPriceDatum[] = []

  constructor(private httpService: HttpService) {}

  async fetchFuelPrices() {
    this.logger.debug('Last fuel prices import', this.lastImport)

    if (differenceInHours(new Date(), this.lastImport) < MIN_IMPORT_INTERVAL_HOURS) {
      return
    }

    try {
      this.logger.debug('Fetching fuel prices')
      const res$ = this.httpService.get<{ value: CbsData[] }>(DATA_LOCATION)
      const res = await firstValueFrom(res$)
      this.logger.debug('Fetched fuel prices')
      
      this.fuelPricesData = res.data.value
        .map((e) => ({
          date             : parse(e.Perioden, 'yyyyMMdd', new Date()),
          [FuelType.LPG]   : e.Lpg_3,
          [FuelType.DIESEL]: e.Diesel_2,
          [FuelType.PETROL]: e.BenzineEuro95_1,
        }))
        .filter((e) => isAfter(e.date, new Date('2020-01-01')))
      this.lastImport = new Date()
      return true
    } catch (error) {
      this.logger.error('Error fetching fuel prices')
      throw error
    }
  }

  async getFuelPricePerLiter(date: Date, fuelType: FuelType) {
    await this.fetchFuelPrices()
    const closestDate = closestTo(
      date,
      this.fuelPricesData.map((e) => e.date),
    )
    const datum = this.fuelPricesData.find((el) => el.date.getTime() === closestDate.getTime())
    return datum[fuelType]
  }

  async getFuelAmount(date: Date, amountEur: number, fuelType: FuelType) {
    const pricePerLiter = await this.getFuelPricePerLiter(date, fuelType)
    return amountEur / pricePerLiter
  }

  calculateFuelEmissions(fuelType: FuelType, amountLiters: number) {
    return CO2_EQ_PER_LITER[fuelType] * amountLiters
  }
}
