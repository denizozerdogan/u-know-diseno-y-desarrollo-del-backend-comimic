import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../course/entities/course.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Purchase } from './entities/purchase.entity';


@Module({
  controllers: [PurchaseController],
  providers: [PurchaseService],
  imports:[TypeOrmModule.forFeature([Course, User, Purchase]), UserModule]

})
export class PurchaseModule {}
