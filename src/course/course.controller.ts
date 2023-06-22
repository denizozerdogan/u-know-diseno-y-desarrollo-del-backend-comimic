import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post(':courseId/star')
  @UsePipes(ValidationPipe)
  async updateCourseStar(@Param('courseId') courseId: number, @Body('star') star: number, ParseIntPipe): Promise<Course> {
    return this.courseService.updateCourseStar(courseId, star);
  }


  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':courseId')
  findOne(@Param('courseId') courseId: string) {
    return this.courseService.findOne(+courseId);
  }

  @Patch(':courseId')
  update(@Param('courseId') courseId: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+courseId, updateCourseDto);
  }

  @Delete(':courseId')
  remove(@Param('courseId') courseId: string) {
    return this.courseService.remove(+courseId);
  }
}
