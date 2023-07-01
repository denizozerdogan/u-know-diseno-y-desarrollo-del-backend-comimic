import { ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { User } from '../user/entities/user.entity';
import { CourseService } from '../course/course.service';
import { Course } from 'src/course/entities/course.entity';

@Injectable()
export class PurchaseService {

  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    private readonly courseService: CourseService,
  ) {}
 
  async makePurchase(
    createPurchaseDto: CreatePurchaseDto,
    user: User,
  ): Promise<Purchase> {
    const { courseId } = createPurchaseDto;

    // const course = await this.courseService.findOne(courseId);
    const course: Course = await this.courseService.findOne(courseId);

    const existingPurchase = await this.purchaseRepository.findOne({
      where: {
        buyer: { id: user.id },
        course: { courseId: courseId },
      },
    });

  
    if (existingPurchase) {
      throw new ConflictException('You have already purchased this course.');
    }

    const purchase = new Purchase();
    purchase.buyer = user;
    purchase.course = course;
  
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

  findOne(id: number) {
    return `This action returns a #${id} purchase`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchase`;
  }
}

// update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
//     return `This action updates a #${id} purchase`;
//   }
