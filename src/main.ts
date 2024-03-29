import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'

const PORT = process.env.PORT || 3010

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.use(cookieParser('geefaanwat'))

  console.log(`Starting app on port ${PORT}`)

  await app.listen(PORT)
}
bootstrap()
