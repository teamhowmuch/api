import { Test, TestingModule } from '@nestjs/testing'
import { CarfuelService } from './carfuel.service'
import { HttpModule } from '@nestjs/axios'

describe('CarfuelService', () => {
  let service: CarfuelService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [CarfuelService],
    }).compile()

    service = module.get<CarfuelService>(CarfuelService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should load fuel prices', async () => {
    expect(await service.fetchFuelPrices()).toBe(true)
  })

  it('should give me a fuel price', async () => {
    const res = await service.getFuelPricePerLiter(new Date('2022-01-01'), 'petrol')
    expect(typeof res).toBe('number')
  })

  it('should calculate CO2 for an amount of fuel', () => {
    const res = service.calculateFuelEmissions('petrol', 10)
    expect(typeof res).toBe('number')
  })

  it('should calculate CO2 for an amount in EUR', async () => {
    const date = new Date()
    const totalAmount = 125
    const type = 'petrol'
    const price = await service.getFuelPricePerLiter(date, type)
    const liters = await service.getFuelAmount(date, totalAmount, type)
    const co2 = service.calculateFuelEmissions('petrol', liters)
    console.log(`you bought ${totalAmount} of ${type} on ${date}. We guessed price was ${price}. So that would be ${liters}L and ${co2}CO2eq`)
    expect(typeof co2).toBe('number')
  })
})
