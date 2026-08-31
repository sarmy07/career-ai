import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('CareerAi API')
    .setDescription('AI-powered resume analysis and job matching platform API')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const document = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/career-ai', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log('career-ai is running on http://localhost:3000');
}
bootstrap();
