import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

 /*  createCourse(createCourseDto: CreateCourseDto) {
    return 'This action adds a new course';
  } */

  

  findAll() {
    return `This action returns all course`;
  }
  
  async createCourse(
    createCourseDto: CreateCourseDto,
    context: ExecutionContext,
  ): Promise<Course> {
    const { title, description, difficulty, topic } = createCourseDto;

    const request = context.switchToHttp().getRequest();
    const user: User = request.user.id; // Assuming the currently authenticated user is attached to the request

    const course = new Course();
    course.title = title;
    course.description = description;
    course.difficulty = difficulty;
    course.topic = topic;
    course.creator = user; // Assign the current user as the creator of the course

    return this.courseRepository.save(course);
  }

  // TODO check if the calculateRating is instantiated
  // async updateCourseStar(courseId: number, star: number, id: number): Promise<Course> {
  //   const course = await this.courseRepository
  //     .createQueryBuilder('course')
  //     .leftJoinAndSelect('course.buyers', 'buyer')
  //     .where('course.courseId = :courseId', { courseId })
  //     .getOne();
  
  //   // Check if the user has bought the course
  //   const userHasBoughtCourse = course.buyers.some((buyer) => buyer.id === id);
  //   if (!userHasBoughtCourse) {
  //     throw new UnauthorizedException('User has not bought the course.');
  //   }
  
  //   course.star.push(star); // Add the new star to the array
  //   await this.courseRepository.save(course); // Save the updated course to trigger the @BeforeUpdate hook
  //   return course;
  // }
 
  /*  async updateCourseStar(courseId: number, star: number, id: number): Promise<Course> {
    const course = await this.courseRepository.findOne(courseId, { relations: ['buyers'] });
  
    // Check if the user has bought the course
    const userHasBoughtCourse = course.buyers.some((buyer) => buyer.id === id);
    if (!userHasBoughtCourse) {
      throw new UnauthorizedException('User has not bought the course.');
    }
  
    course.star.push(star); // Add the new star to the array
    await this.courseRepository.save(course); // Save the updated course to trigger the @BeforeUpdate hook
    return course;
  } */
  
  /*  async updateCourseStar(courseId: number, star: number): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { courseId } });
    course.star.push(star); // Add the new star to the array
    await this.courseRepository.save(course); // Save the updated course to trigger the @BeforeUpdate hook
    return course;
  } */
  
  findOne(courseId: number) {
    return `This action returns a #${courseId} course`;
  }

  update(courseId: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${courseId} course`;
  }

  remove(courseId: number) {
    return `This action removes a #${courseId} course`;
  }
}
