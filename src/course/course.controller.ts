import { 
  Controller,
   Get,Post,
   Body,Patch,
   Param,Delete,
   Req,UseGuards,
  NotFoundException,
  UnauthorizedException,
  ParseIntPipe,Query, BadRequestException, ConflictException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/entities/role.enum';


@ApiBearerAuth()
@ApiTags('course')
@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,)
 {}

  @Post('course-creation')
  @UseGuards(JwtAuthGuard)
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @Req() req: Request,
  ): Promise<Course> {
    const user: User = req['user'];
    createCourseDto.creatorId = user.id;
    
    return this.courseService.createCourse(createCourseDto, user);
  } 
  
  // !! COURSES NOT APPROVED
  @Get('unapproved')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async getUnapprovedCourses(): Promise<Course[]> {
    const unapprovedCourses = await this.courseService.getAllUnapproved();
    return unapprovedCourses;
  }

  @Get('unapproved/:courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getUnapCourseById(@Param('courseId', ParseIntPipe) courseId: number): Promise<Course> {
    const unapprovedCourse = await this.courseService.getUnapprovedCourseById(courseId);
    return unapprovedCourse;
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: Request): Promise<Course[]> {
    try {
      const user = req['user'];
      const userRole = user.role;
      const courses = await this.courseService.findAll(userRole);
      if (!courses) {
        throw new NotFoundException('No courses found.');
      }
      return courses;
    } catch (error) {
      throw new NotFoundException('No courses found.');
    }
  }
    
  @Get('search')
  async searchByKeyword(@Query('keyword') keyword: string): Promise<Course[]> {
    try {
      const courses = await this.courseService.searchByKeyword(keyword);
      if (!courses || courses.length === 0) {
        throw new NotFoundException('No courses found.');
      }
      return courses;
    } catch (error) {
      
      throw new NotFoundException('No courses found.');
    }
  }

    @Get(':courseId')
    async findOne(@Param('courseId', ParseIntPipe) courseId: number) {

      try {
        return await this.courseService.findOne(courseId);
      }   
      catch (error) { 
        if (error instanceof NotFoundException) {
          throw new NotFoundException(error.message);
      }
        throw error;
      }
    }
    

    @Patch(':courseId')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.USER)
    async update(
      @Param('courseId', ParseIntPipe) courseId: number,
      @Body() updateCourseDto: UpdateCourseDto,
      @Req() req) {
      try {
        const userId = req.user.id;
        const updatedCourse = await this.courseService.update(courseId, updateCourseDto, userId);
        if (!updatedCourse) {
          throw new NotFoundException('Course not found.');
        }
        return updatedCourse;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException('Course not found.');
        }
        throw new NotFoundException('Failed to update the course.');
      }
    }

    @Delete('admin/:courseId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    removeCourse(@Param('courseId', ParseIntPipe) courseId: number, @Req() req) {
      if (req.user.role !== Role.ADMIN) {
        throw new UnauthorizedException('Unauthorized');
      }
      return this.courseService.removeCoursebyAdmin(courseId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':courseId')
    async deleteCourse(
      @Param('courseId') courseId: number,
      @Req() req: Request,
    ): Promise<void> {
      const user: User= req['user'];
      await this.courseService.deleteCourseIfNoPurchases(courseId, user.id);
    }

    @Patch(':courseId/approve')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async approveCourse(
      @Param('courseId') courseId: string,
    ): Promise<Course> {
      try {
        const updatedCourse = await this.courseService.updateApproval(+courseId, true,50);
        if (!updatedCourse) {
          throw new NotFoundException('Course not found.');
        }

        const creator = updatedCourse.creator;
        creator.wallet += 50;
        await this.userRepository.save(creator);


        return updatedCourse;
      } catch (error) {

        if (error instanceof ConflictException) {
          throw error;
        }
    
        throw new BadRequestException('Failed to update the course.');
      }
    }

    @Get(':id/mycourses')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER)
    async findUserCourses(@Param('id') userId: number): Promise<Course[]> {
      return this.courseService.findUserCourses(userId);
    }

}



