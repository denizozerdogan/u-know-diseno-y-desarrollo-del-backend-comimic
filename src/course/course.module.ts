import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { Purchase } from '../purchase/entities/purchase.entity';
import { PurchaseService } from 'src/purchase/purchase.service';
import { PurchaseModule } from '../purchase/purchase.module';

@Module({
  imports:[TypeOrmModule.forFeature([Course, User, Purchase]),
  UserModule, PurchaseModule],
  controllers: [CourseController],
  providers: [CourseService, JwtAuthGuard],
})
export class CourseModule {}
