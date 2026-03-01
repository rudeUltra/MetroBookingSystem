import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser()); // Essential for reading the JWT cookie
  app.enableCors({
    origin: process.env.FRONTEND_URL, // Your Frontend URL
    credentials: true,               // Allows browser to send cookies back
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
