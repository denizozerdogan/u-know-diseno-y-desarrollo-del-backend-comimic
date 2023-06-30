import { 
  Controller,
   Get,
   Post,
   Body,
   Patch,
   Param,
   Delete,
   Req,
  UseGuards,
  NotFoundException,
  HttpStatus,
  Res,
  UnauthorizedException,
  ParseIntPipe,
  ConflictException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/entities/role.enum';


@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}


    @Post('course-creation')
    @UseGuards(JwtAuthGuard)
    async createCourse(
      @Body() createCourseDto: CreateCourseDto,
      @Req() req: Request,
    ): Promise<Course> {
      const user: User = req['user']['userId'];
      createCourseDto.creatorId = user.id;
      try {
      return this.courseService.createCourse(createCourseDto, user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }
      // !! COURSES NOT APPROVED
  @Get('unapproved')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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

  @Delete('unapproved/:courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteUnapprovedCourse(@Param('courseId', ParseIntPipe) courseId: number): Promise<boolean> {
    const deleted = await this.courseService.deleteUnapproved(courseId);
    return deleted;
  }


  @Get('')
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: Request): Promise<Course[]> {
    try {
      const user = req.user as User;
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
        throw new Error('Failed to update the course.');
      }
    }

    @Delete(':courseId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    removeCourse(@Param('courseId', ParseIntPipe) courseId: number, @Req() req) {
      if (req.user.role !== Role.ADMIN) {
        throw new UnauthorizedException('Unauthorized');
      }
      return this.courseService.removeCourse(courseId);
    }

    @Patch(':courseId/approve')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async approveCourse(
      @Param('courseId') courseId: string,
    ): Promise<Course> {
      try {
        const updatedCourse = await this.courseService.updateApproval(+courseId, true);
        if (!updatedCourse) {
          throw new NotFoundException('Course not found.');
        }
        return updatedCourse;
      } catch (error) {
        throw new Error('Failed to update the course.');
   
      }
    }
  
  @Get(':id/mycourses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async findUserCourses(@Param('id') userId: number): Promise<Course[]> {
    return this.courseService.findUserCourses(userId);
  }
}











/*   @UseGuards(JwtAuthGuard)
  @Post()
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @Req() req: Request,
  ): Promise<Course> {
    const user: User = req.user as User;
    return this.courseService.createCourse(createCourseDto, user);
  } */
  /* @UseGuards(JwtAuthGuard)
  @Post()
    async createCourse(@Body() createCourseDto: CreateCourseDto, @Req() req: Request): Promise<Course> {
      const user: User =  request.user as User;
      return this.courseService.createCourse(createCourseDto, user);
    } */
/* //!!!!!!!!!!!
    @Post(':id/course-creation')
    async createCourse(
      @Body() createCourseDto: CreateCourseDto,
      @Req() req: Request,
    ): Promise<Course> {
      const user: User = request.user as User;
      return this.courseService.createCourse(createCourseDto, user);
    } 
 */


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
/*    @Post()
  async createCourse(@Body() createCourseDto: CreateCourseDto, @Req() request: Request) {
    const { id } = request.user; // Assuming the authenticated user ID is available in the request

    const course = await this.courseService.createCourse(createCourseDto, id);

    return course;
  }  */


 /*   @Post()
  async createCourse(
    @Body() createCourseDto: CreateCourseDto, @Req() request: Request): Promise<Course> {
 
      return this.courseService.createCourse(createCourseDto, request.user.id);
} */

  /* @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  } */




