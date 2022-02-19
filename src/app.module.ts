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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DB,
      entities: Entities.Collection,
      synchronize:
        process.env.NODE_ENV !== 'production' && process.env.DB_SYNC === 'true',
      // logging:true
    }),
    UsersModule,
    AuthModule,
    BankConnectionsModule,
    EmissionsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
