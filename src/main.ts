import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { BRAND_NAME, DEFAULT_PORT } from './common/constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { EnvironmentVariables } from './config/env/env.validation';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { SeedService } from './common/services/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<EnvironmentVariables>);

  app.enableCors({
    origin: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new AllExceptionsFilter());

  app.setGlobalPrefix('api');

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const port = configService.get('PORT', DEFAULT_PORT);

  // data initialization
  const seedService = app.get(SeedService);
  await seedService.InitializeData();
  // data initialization

  // swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${BRAND_NAME} API`)
    .setDescription(`A NestJS API for ${BRAND_NAME} System`)
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/', app, document);
  // swagger configuration

  await app.listen(port);
}
bootstrap();
