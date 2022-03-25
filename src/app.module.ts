import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { HealthController } from './health.controller';
import { AuthModule } from './auth/auth.module';
import { BankConnectionsModule } from './bank-connections/bank-connections.module';
import { EmissionsModule } from './emissions/emissions.module';
import * as Entities from './entity';
import { BullModule } from '@nestjs/bull';
import { TransactionModule } from './transaction/transaction.module';
import { SensorsModule } from './sensors/sensors.module';
import { PostgresConfigService } from './config/typeorm-config-service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
        password: process.env.REDIS_PASSWORD,
      },
    }),
    UsersModule,
    AuthModule,
    BankConnectionsModule,
    TransactionModule,
    EmissionsModule,
    SensorsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, PostgresConfigService],
})
export class AppModule {}
