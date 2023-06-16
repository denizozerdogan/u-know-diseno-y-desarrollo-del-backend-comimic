import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set the global route prefixapp.setGlobalPrefix('api');
  const config = new DocumentBuilder()
  .setTitle('U-KNOW API')
  .setDescription('API for the U-KNOW platform')
  .setVersion('1.0')
  //.addTag('user') 
  //endpoints para conectar c swagger
  .build();const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
//En este ejemplo, app.enableCors() se coloca justo después de crear la instancia de la aplicación (NestFactory.create(AppModule)) y antes de iniciar el servidor (app.listen(3000)). Al habilitar CORS de esta manera, tu API permitirá solicitudes desde cualquier origen. Si deseas restringir los orígenes permitidos, puedes proporcionar opciones de configuración a app.enableCors().
