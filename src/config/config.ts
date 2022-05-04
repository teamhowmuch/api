export default () => ({
  port: parseInt(process.env.PORT, 10) || 3010,
  jwtSecret: process.env.JWT_SECRET,
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_HOST, 10) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    db: process.env.DB_DB,
  },
  nordigen: {
    id: process.env.NORDIGEN_ID,
    secret: process.env.NORDIGEN_KEY,
  },
})
