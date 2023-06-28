import { Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { Course } from '../course/entities/course.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PurchaseService {
  userService: any;
  courseService: any;
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    // private userService: UserService,
  ) {}
  
  async makePurchase(userId: number, courseId: number): Promise<Purchase> {
    const user: User = await this.userService.findById(userId);
    const course: Course = await this.courseService.findById(courseId);
  
    const purchase = new Purchase();
    purchase.buyer = user;
    purchase.course = course;
  
    return this.purchaseRepository.save(purchase);
  }
  // async makePurchase(
  //   createPurchaseDto: CreatePurchaseDto,
  //   user: User, 
  //   course: Course): Promise<Purchase> {

  //   // const { userId, courseId} = createPurchaseDto;
  //   const purchase = new Purchase();
  //   purchase.buyer = user;
  //   purchase.course = course;

  //   return this.purchaseRepository.save(purchase);
  // }

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
