import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SentryService } from '@ntegral/nestjs-sentry'
import { AppModule } from './app.module'

const PORT = process.env.PORT || 3010

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  console.log(`Starting app on port ${PORT}`)

  app.useLogger(SentryService.SentryServiceInstance())
  await app.listen(PORT)
}
bootstrap()
