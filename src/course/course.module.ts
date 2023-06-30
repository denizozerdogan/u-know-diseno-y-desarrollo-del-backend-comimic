import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { UserModule } from 'src/user/user.module';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { PurchaseService } from 'src/purchase/purchase.service';

@Module({
  imports:[TypeOrmModule.forFeature([Course, User, Purchase]), UserModule],
  controllers: [CourseController],
  providers: [CourseService, JwtAuthGuard, PurchaseService]
})
export class CourseModule {}
