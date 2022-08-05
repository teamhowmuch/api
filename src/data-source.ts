import { DataSource } from 'typeorm'
import { Collection } from './entities'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB,
  logging: false,
  synchronize: true,
  entities: Collection,
  migrations: [`src/migration/**/*.ts`],
  subscribers: [`src/subscriber/**/*.ts`],
})
