import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'

const PORT = process.env.PORT || 3010

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const allowedOrigins = ['34.77.31.159', '23.251.142.192']
  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('localhost')
  }
  if (process.env.ALLOW_ORIGIN) {
    allowedOrigins.push('bot-pages.vercel.app')
  }

  console.log('allow origins', allowedOrigins)

  app.enableCors({
    credentials: true,
    origin: allowedOrigins,
  })
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.use(cookieParser('geefaanwat'))

  console.log(`Starting app on port ${PORT}`)

  await app.listen(PORT)
}
bootstrap()
