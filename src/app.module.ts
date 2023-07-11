import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import * as Entities from './entities'
import { SentryModule } from './sentry/sentry.module'
import * as Sentry from '@sentry/node'
import config from './config/config'
import { APP_GUARD } from '@nestjs/core'
import { RolesGuard } from './auth/roles.guard'
import { ChatsModule } from './chats/chats.module'
import { CompanyNamesModule } from './company-names/company-names.module'
import { EmailModule } from './email/email.module'
import { CompaniesModule } from './companies/companies.module'
import { GqlModule } from './gql/gql.module'

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DB,
      entities: Entities.Collection,
      useUTC: true,
      ssl: process.env.NODE_ENV === 'production' ? { ca: process.env.SSL_CERT } : false,
      synchronize: true,
      migrationsTableName: 'migrations',
      migrationsRun: false,
      migrations: ['dist/migration/**/*.js'],
      // logging: true,
    }),
    SentryModule.forRoot({
      dsn: 'https://f4c1bb286a2c44c3a38fb07945c5c052@o1193141.ingest.sentry.io/6334997',
      debug: process.env.NODE_ENV !== 'development',
      environment: process.env.NODE_ENV,
    }),
    UsersModule,
    AuthModule,
    SentryModule,
    ChatsModule,
    CompanyNamesModule,
    EmailModule,
    CompaniesModule,
    GqlModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(Sentry.Handlers.requestHandler()).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    })
  }
}
