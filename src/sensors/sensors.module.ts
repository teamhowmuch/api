import { Module } from '@nestjs/common';
import { Sensor } from 'src/entity/Sensor';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor]),UsersModule],
  controllers: [SensorsController],
  providers: [SensorsService]
})
export class SensorsModule {}
