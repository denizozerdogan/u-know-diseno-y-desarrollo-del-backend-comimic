import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set the global route prefix
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('U-KNOW API')
    .setDescription(
      'API for the U-KNOW platform for Information Exchange and Content Sharing',
    )
    .setVersion('1.0')
    //.addTag('user')
    //endpoints para conectar c swagger
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
