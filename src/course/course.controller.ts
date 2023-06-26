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
  ExecutionContext,
  Inject,
  NotFoundException,
  HttpStatus,
  HttpException,
  UseFilters,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { request, response } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/entities/role.enum';


@ApiBearerAuth()
//@UseGuards(JwtAuthGuard)
@ApiTags('course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService,
    private readonly userService: UserService) {}


    @Post(':id/course-creation')
    @UseGuards(JwtAuthGuard)
    async createCourse(
      @Body() createCourseDto: CreateCourseDto,
      @Req() req: Request,
    ): Promise<Course> {
      const user: User = req['user']['userId'];
      createCourseDto.creatorId = user.id;
      
      return this.courseService.createCourse(createCourseDto, user);
    } 


   /*   @Post(':id/course-creation')
    @UseGuards(JwtAuthGuard)
    async createCourse(
      @Body() createCourseDto: CreateCourseDto,
      @Req() req: Request,
    ): Promise<Course> {
      const user: User = req['user']['userId'];
    
      // Update the user's wallet
       this.userService.updateUserWallet(user.id, 200);
    
      createCourseDto.creatorId = user.id;
    
      return this.courseService.createCourse(createCourseDto, user);
    }  */


    @Get('')
    async findAll(@Res() response) {
      try {
        const courses = await this.courseService.findAll();
        if (!courses) {
          throw new NotFoundException('No courses found.');
        }
        return courses;
      } catch (error) {
        throw new NotFoundException('No courses found.');
      }
    }
    

    @Get(':courseId')
    async findOne(@Res() response, @Param('courseId') courseId: string) {
      try {
        const course = await this.courseService.findOne(+courseId);
    
        if (!course) {
          return response.status(HttpStatus.NOT_FOUND).send(`Course ${courseId} not found.`);
        }
    
        return course;
      } catch (error) {
        return response.status(HttpStatus.NOT_FOUND).send(`Course ${courseId} not found.`);
      }
    }
    

    @Patch(':courseId')
    @UseGuards(JwtAuthGuard)
    async update(@Param('courseId') courseId: string, @Body() updateCourseDto: UpdateCourseDto) {
      try {
        const updatedCourse = await this.courseService.update(+courseId, updateCourseDto);
        if (!updatedCourse) {
          throw new NotFoundException('Course not found.');
        }
        return updatedCourse;
      } catch (error) {
        throw new Error('Failed to update the course.');
      }
    }

    @Delete(':courseId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async remove(@Param('courseId') courseId: string) {
    try {
      const deletedCourse = await this.courseService.remove(+courseId);
      if (deletedCourse === undefined) {
        throw new NotFoundException('Course not found.');
      }
      return deletedCourse;
    } catch (error) {
      throw new NotFoundException('Course not found.');
    }
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




