import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { Course } from '../course/entities/course.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CourseService } from '../course/course.service';

@Injectable()
export class PurchaseService {
  
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    private userService: UserService,
/*     private courseService: CourseService,
 */    
  ) {}
  
 
  async makePurchase(
    createPurchaseDto: CreatePurchaseDto,
    userId: User,
  ): Promise<Purchase> {
    
  
    const { courseId } = createPurchaseDto;

    const existingPurchase = await this.purchaseRepository.findOne({
      where: {
        buyer: userId,
        course: courseId,
      },
    });
  
    if (existingPurchase) {
      throw new ConflictException('You have already purchased this course.');
    }
    
    const purchase = new Purchase();
    purchase.buyer = userId;
    purchase.course = courseId;
  
    return this.purchaseRepository.save(purchase);
  }

  async countCoursePurchases(courseId: number): Promise<number> {
    const coursePurchaseTotal = await this.purchaseRepository
      .createQueryBuilder('purchase')
      .where('purchase.courseId = :courseId', { courseId })
      .getCount();

    return coursePurchaseTotal;
  }

  findAll() {
    return `This action returns all purchase`;
  }
/* 
  async findOneByCourseId(courseId: number): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findOne({ where: { course: { courseId } } });
  
    if (!purchase) {
      throw new NotFoundException(`Purchase for course ${courseId} not found.`);
    }
  
    return purchase;
  }
 */

/*   remove(id: number) {
    return `This action removes a #${id} purchase`;
  } */
}

// update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
//     return `This action updates a #${id} purchase`;
//   }
