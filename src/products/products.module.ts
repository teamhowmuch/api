import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { CarfuelController } from './carfuel/carfuel.controller'
import { CarfuelService } from './carfuel/carfuel.service'
@Module({
  imports    : [HttpModule],
  controllers: [CarfuelController],
  providers  : [CarfuelService],
  exports    : [CarfuelService],
})
export class ProductsModule {}
