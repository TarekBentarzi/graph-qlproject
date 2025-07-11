import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // utile si tu utilises les cookies plus tard
  });
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
