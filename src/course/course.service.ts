import { BadRequestException, ConflictException, ExecutionContext, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Purchase } from '../purchase/entities/purchase.entity';
import { PurchaseService } from '../purchase/purchase.service';


@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private userService: UserService,
/*     private readonly purchaseService: PurchaseService,
 */    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,


 ) {}

 async createCourse(createCourseDto: CreateCourseDto, user: User): Promise<Course> {
  const { title, description, difficulty, topic, content } = createCourseDto;


  // Check if a course with the same description already exists
  const existingCourseWithDescription = await this.courseRepository.findOne({ where: { description } });
  if (existingCourseWithDescription) {
    throw new ConflictException('A course with the same description already exists.');
  }
  const existingCourseWithTitle = await this.courseRepository.findOne({ where: { title } });
  if (existingCourseWithTitle) {
    throw new ConflictException('A course with the same title already exists.');
  }
  const existingCourseWithContent = await this.courseRepository.findOne({ where: { content } });
  if (existingCourseWithContent) {
    throw new ConflictException('A course with the same content already exists.');
  }

    const course = new Course();
    course.title = title;
    course.description = description;
    course.difficulty = difficulty;
    course.topic = topic;
    course.content = content;
    course.creator = user; // Assign the current user as the creator of the course
  
 
  return this.courseRepository.save(course);
}
  

  //Todo los cursos pero sin contenido (publico)
  async findAll(): Promise<Course[]> {
    try {
   /*    if (userRole === 'admin') {
        return this.courseRepository.find({
          order: { rating: 'DESC' },
          select: ['title', 'topic', 'price', 'rating'],
        });
      } else { */
        const courses = await this.courseRepository.find({
          where: { approved: true },
          order: { rating: 'DESC' },
          select: ['title', 'topic', 'price', 'rating'],
        });
  
        if (!courses || courses.length === 0) {
          throw new NotFoundException('No approved courses found.');
        }
  
        return courses;
      }
     catch (error) {
      throw new Error('Error while fetching the courses.');
    }
  }


  // Curso sin contenido (publico)
  async findOne(courseId: number): Promise<Course> {
    //try {
      const course = await this.courseRepository.findOne({ where: { courseId }, select: ['title','topic', 'price', 'rating', 'description', 'stars', 'comments'] });
      
      if (!course) {
        throw new NotFoundException(`Course ${courseId} not found.`);
      }
      return course;
   // } catch (error) {
   //   throw new Error('Error while fetching the course.');
   // }
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
  async getAllUnapproved(): Promise<Course[]> {
    try {
      const unapprovedCourses = await this.courseRepository.createQueryBuilder('course')
        .where('course.approved = :approved', { approved: false })
        .getMany();
      return unapprovedCourses;
    } catch (error) {
      throw new Error('Error while fetching unapproved courses.');
    }
  }

  async getUnapprovedCourseById(courseId: number): Promise<Course> {
    try {
      const unapprovedCourse = await this.courseRepository.createQueryBuilder('course')
        .where('course.courseId = :courseId', { courseId })
        .andWhere('course.approved = :approved', { approved: false })
        .getOne();
  
      if (!unapprovedCourse) {
        throw new NotFoundException(`Unapproved course with ID '${courseId}' not found.`);
      }
  
      return unapprovedCourse;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error while fetching unapproved course.');
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

  // async findUserCourses(userId: number): Promise<Course[]> {
  //   try {
  //     const courses = await this.courseRepository
  //       .createQueryBuilder('course')
  //       .where('course.creatorId = :userId', { userId })
  //       .getMany();
  //       return courses;
  //     }
  //   catch (error) {
  //     throw new NotFoundException('No courses found for the user.');
  //   }
  // }
  async findUserCourses(userId: number): Promise<Course[]> {
    const courses = await this.courseRepository
      .createQueryBuilder('course')
      .where('course.creatorId = :userId', { userId })
      .getMany();
  
    if (courses.length === 0) {
      throw new NotFoundException('No courses found for the user.');
    }
     
    return courses;
  }
  


  async searchByKeyword(keyword: string): Promise<Course[]> {
    try {
      const courses = await this.courseRepository.createQueryBuilder('course')
        .select(['course.title', 'course.topic', 'course.price', 'course.rating'])
        .where('course.content LIKE :keyword', { keyword: `%${keyword}%` })
        .getMany();
  
      return courses;
    } catch (error) {
      throw new NotFoundException('No courses found.');
    }
  }

  // ** To validate the user bought and owns the course
  async validateCoursePurchase(userId: number, courseId: number): Promise<boolean> {
    const purchase = await this.purchaseRepository.findOne({
      where: {
        buyer: { id: userId },
        course: { courseId },
        reviewed: false,
      },
    });

    return !!purchase;
  };

 // ** To update the course stars 
  async updateCourseStars(courseId: number, userId: number, stars: number): Promise<Course> {
  
    const course = await this.courseRepository.findOne({where: {courseId }});
    if (!course) {
      throw new Error('Course not found');
    }
    // Check if the user has already reviewed the course
    const isReviewed = await this.purchaseRepository
    .createQueryBuilder('purchase')
    .where('purchase.course.courseId = :courseId', { courseId })
    .andWhere('purchase.user.userId = :userId', { userId })
    .andWhere('purchase.reviewed = true')
    .getOne();

    if (isReviewed) {
      throw new Error('User has already reviewed the course');
    }
    course.stars = [{ value: stars }];
    await this.courseRepository.save(course);

    isReviewed.reviewed = true; // Set the reviewed column to true
    await this.purchaseRepository.save(isReviewed);
  
    const updatedCourse = await this.calculateCourseRating(courseId);
    return updatedCourse;
  }

  // ** Calculate the new value of the rating field when a new star is added 
  private async calculateCourseRating(courseId: number): Promise<Course> {
    const course = await this.courseRepository.findOne({where: {courseId }});

    if (!course) {
      throw new Error('Course not found');
    }

    const reviewedPurchases = await this.purchaseRepository.find({
      where: {
        course: {
          courseId,
        },
        reviewed: true,
      },
    });

    const totalRatings = reviewedPurchases.length;

    if (totalRatings === 0) {
      course.rating = 0;
    } else {
      const sumRatings = reviewedPurchases.reduce((total, purchase) => total + purchase.course.stars[0].value, 0);
      const averageRating = (sumRatings - 4.8 * Math.min(totalRatings, 4)) / Math.max(totalRatings - 4, 1);
      course.rating = parseFloat(averageRating.toFixed(1));
    }

    await this.courseRepository.save(course);

    return course;
  }

}

  // async removeCourseByUser(courseId: number, userId : number){
  //   //buscar curso en purchase
  //   const course = await this.purchaseRepository.findOne({where: {courseId}})

  // }


 
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
  
  /*  async updateCourseStar(courseId: number, star: number): Promise<Course> {*/
