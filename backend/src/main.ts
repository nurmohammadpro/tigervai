import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import compression from 'compression';
import { AllExceptionsFilter } from 'lib/all-exceptions.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
    })
  );
    app.useGlobalFilters(new AllExceptionsFilter());
 

  // Only setup Swagger if not in watch mode
  if (process.env.NODE_ENV !== 'development' || process.env.ENABLE_SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('pharmacy example')
      .setDescription('The pharmacy description')
      .setVersion('1.0')
      .addTag('pharmacy')
      .build();
    
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }
  await app.listen(process.env.PORT ??4000);
}
bootstrap();
