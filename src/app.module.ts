import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ContentModule } from './content/content.module';


@Module({
  imports: [UserModule, ContentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
