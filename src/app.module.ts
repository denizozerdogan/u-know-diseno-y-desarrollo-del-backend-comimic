import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ContenidoModule } from './contenido/contenido.module';

@Module({
  imports: [UserModule, ContenidoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
