import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../course/entities/course.entity';
import { UserModule } from '../user/user.module';
import { Purchase } from './entities/purchase.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Course, Purchase]),
  UserModule],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [PurchaseService]

})
export class PurchaseModule {}
