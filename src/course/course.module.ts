import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[TypeOrmModule.forFeature([Course]), UserModule],
  controllers: [CourseController],
  providers: [CourseService, JwtService]
})
export class CourseModule {}
