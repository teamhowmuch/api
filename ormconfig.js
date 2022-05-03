const typeormFolder = process.env.NODE_ENV === 'development' ? 'src' : 'dist'

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB,
  logging: false,
  synchronize: true,
  entities: [`${typeormFolder}/entity/**/*.ts`],
  migrations: [`${typeormFolder}/migration/**/*.ts`],
  subscribers: [`${typeormFolder}/subscriber/**/*.ts`],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
}
