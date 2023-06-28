import { BadRequestException, ExecutionContext, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';


@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private userService: UserService, // Inject the UserService

 ) {}

  async createCourse(
    createCourseDto: CreateCourseDto,
    user: User
  ): Promise<Course> {
    const { title, description, difficulty, topic , content} = createCourseDto;

    const course = new Course();
    course.title = title;
    course.description = description;
    course.difficulty = difficulty;
    course.topic = topic;
    course.content = content;
    course.creator = user; // Assign the current user as the creator of the course
 
    // Update the user's wallet
    //await this.userService.updateUserWallet(user.id, 200);

    return this.courseRepository.save(course);
  }
  

  //Todo los cursos pero sin contenido (publico)
  async findAll(): Promise<Course[]> {
    try {
      const courses = await this.courseRepository.find({
      order: { rating: 'DESC' },
      select: ['title','topic', 'price', 'rating']
      });
      return courses;
    } catch (error) {
      throw new Error('Error while fetching the courses.');
    }
  }


  // Curso sin contenido (publico)
  async findOne(courseId: number): Promise<Course> {
    try {
      const course = await this.courseRepository.findOne({ where: { courseId }, select: ['title','topic', 'price', 'rating', 'description', 'stars', 'comments'] });
      
      if (!course) {
        throw new NotFoundException(`Course ${courseId} not found.`);
      }
      return course;
    } catch (error) {
      throw new Error('Error while fetching the course.');
    }

    
  }





  async update(courseId: number, updateCourseDto: UpdateCourseDto, id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { courseId }, relations: ['creator'] });

    if (!course) {
      throw new NotFoundException('Course not found.');
    }
  
    if (course.creator.id !== id) {
      throw new UnauthorizedException('You are not authorized to update this course.');
    }
  
    const allowedProperties = ['title', 'description', 'topic', 'content', 'difficulty'];
  
    Object.keys(updateCourseDto).forEach((property) => {
      if (!allowedProperties.includes(property)) {
        throw new BadRequestException(`Updating the '${property}' field is not allowed.`);
      }
    });
  
    // Perform the update on the course entity
    course.title = updateCourseDto.title;
    course.description = updateCourseDto.description;
    course.topic = updateCourseDto.topic;
    course.content = updateCourseDto.content;
    course.difficulty = updateCourseDto.difficulty;
  
    const updatedCourse = await this.courseRepository.save(course);
  
    return updatedCourse;
  }
  


  async removeCourse(courseId: number): Promise<boolean> {

    const course = await this.courseRepository.findOne({ where: { courseId } });

    if (!course) {
      throw new NotFoundException(`Course with ID '${courseId}' not found`);
    } const result = await this.courseRepository.delete(courseId);

    if (result.affected === 0) {
      throw new InternalServerErrorException('Failed to delete course');
    }

    return true;
  }

  // !! COURSES NOT APPROVED
  async getUnapproved(): Promise<Course[]> {
    console.log("teste desde service")
    try {
      const unapprovedCourses = await this.courseRepository.createQueryBuilder('course')
        .where('course.approved = :approved', { approved: false })
        .getMany();
        console.log("service" + unapprovedCourses)
      return unapprovedCourses;
    } catch (error) {
      throw new Error('Error while fetching unapproved courses.');
    }
  }

  async deleteUnapproved(courseId: number): Promise<boolean> {
    try {
      const course = await this.courseRepository.createQueryBuilder('course')
        .where('course.courseId = :courseId', { courseId })
        .andWhere('course.approved = :approved', { approved: false })
        .getOne();

      if (!course) {
        throw new NotFoundException(`Unapproved course with ID '${courseId}' not found.`);
      }

      const result = await this.courseRepository.delete(courseId);

      if (result.affected === 0) {
        throw new InternalServerErrorException('Failed to delete unapproved course.');
      }

      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error while deleting unapproved course.');
    }
  }


  //!! WARNING arreglar wallet!
  async updateApproval(courseId: number, approval: boolean): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { courseId } });
    
    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    course.approved = approval;
    const updatedCourse = await this.courseRepository.save(course);

    //Llama a la función updateUserWallet del UserService
    await this.userService.updateUserWallet(course.creator.id, 100); 

    return updatedCourse;
  }
}








// async update(courseId: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
//   try {
//     const course = await this.courseRepository.findOne({ where: { courseId } });
//     if (!course) {
//       throw new Error('Course not found.');
//     }
//     // Perform the update on the course entity
//     course.title = updateCourseDto.title;
//     course.description = updateCourseDto.description;
//     course.difficulty = updateCourseDto.difficulty
//     course.topic = updateCourseDto.topic 
//     course.content = updateCourseDto.content
  
//     const updatedCourse = await this.courseRepository.save(course);
//     return updatedCourse;
//   } catch (error) {
//     throw new Error('Error while updating the course.');
//   }
// }

// async remove(courseId: number): Promise<boolean> {

//   const course = await this.courseRepository.findOne({ where: { courseId } });
//   if (!course) {
//     throw new NotFoundException('Course not found.');
//   }

//   await this.courseRepository.remove(course);

//   return true;
// }

// async remove(courseId: number): Promise<void> {
//   try {
//     const course = await this.courseRepository.findOne({ where: { courseId } });
//     if (!course) {
//       throw new NotFoundException('Course not found.');
//     }

//     await this.courseRepository.remove(course);
//   } catch (error) {
//     throw new Error('Error while removing the course.');
//   }
// }

  /* async createCourse(
    createCourseDto: CreateCourseDto,
    user: User,
  ): Promise<Course> {
    const course = this.courseRepository.create({
      ...createCourseDto,
      creator: user.id,
    });
    return this.courseRepository.save(course);
  } */
 
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


