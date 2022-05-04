module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB,
  logging: false,
  synchronize: true,
  entities: [`src/entity/**/*.ts`],
  migrations: [`src/migration/**/*.ts`],
  subscribers: [`src/subscriber/**/*.ts`],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
}
