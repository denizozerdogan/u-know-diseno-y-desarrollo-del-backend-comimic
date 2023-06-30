import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../course/entities/course.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Purchase } from './entities/purchase.entity';
import { CourseModule } from '../course/course.module';
import { CourseService } from 'src/course/course.service';


@Module({
  controllers: [PurchaseController],
  providers: [PurchaseService, CourseService],
  imports:[TypeOrmModule.forFeature([Course, User, Purchase]), UserModule, CourseModule]

})
export class PurchaseModule {}
