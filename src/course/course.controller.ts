import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Req, ParseIntPipe, UseGuards, ExecutionContext } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course, courseDifficulty } from './entities/course.entity';
import { User } from 'src/user/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

 /*  @Post(':courseId/rate')
  @UsePipes(ValidationPipe)
  async updateCourseStar(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body('star') star: number,
    @GetUser() user: User, // Assuming you have an authentication system to get the current user
  ): Promise<Course> {
    const userId = user.id;
    return this.courseService.updateCourseStar(courseId, star, userId);
  }
 */
  //we will protected for after login need to implement AuthGuard?
 /*  @Post()
  async createCourse(@Body() createCourseDto: CreateCourseDto, @Req() request: Request) {
    const { id } = request.user; // Assuming the authenticated user ID is available in the request

    const course = await this.courseService.createCourse(createCourseDto, id);

    return course;
  } */

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCourse(
    @Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.courseService.createCourse(createCourseDto);
  }

  /* @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  } */

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
