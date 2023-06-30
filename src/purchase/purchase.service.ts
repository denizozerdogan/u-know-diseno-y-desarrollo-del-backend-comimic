import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { User } from '../user/entities/user.entity';
import { CourseService } from '../course/course.service';

@Injectable()
export class PurchaseService {
  
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    // private  readonly courseService : CourseService
  ) {}


 
  async createPurchase(createPurchaseDto: CreatePurchaseDto, userId: User) {
    const { courseId } = createPurchaseDto;
  
    // Verificar si el usuario ya compró el curso
    const existingPurchase = await this.purchaseRepository
      .createQueryBuilder('purchase')
      .where('purchase.buyer = :userId', { userId })
      .andWhere('purchase.course = :courseId', { courseId })
      .getOne();
  
    if (existingPurchase) {
      throw new NotFoundException('El usuario ya ha comprado este curso.');
    }
  
    // // Verificar si el curso existe
    // const course = await this.courseService.findOne( courseId.courseId );
    // if (!course) {
    //   throw new NotFoundException('El curso no existe.');
    // }
  
    // Crear la nueva compra
    const purchase = new Purchase();
    purchase.buyer = userId;
    purchase.course = courseId; // Asignar directamente el objeto del curso
    return this.purchaseRepository.save(purchase);
  }
  

  
  async countCoursePurchases(courseId: number): Promise<number> {
    const coursePurchaseTotal = await this.purchaseRepository
      .createQueryBuilder('purchase')
      .where('purchase.courseId = :courseId', { courseId })
      .getCount();

    return coursePurchaseTotal;
  }
 
  // async makePurchase(
  //   createPurchaseDto: CreatePurchaseDto,
  // ): Promise<Purchase> {
  //   const { courseId, userId } = createPurchaseDto;
  
  //   // Verificar si el usuario ya ha comprado el curso
  //   const hasUserPurchasedCourse = await this.checkUserPurchasedCourse(userId.id, courseId.courseId);
  
  //   if (hasUserPurchasedCourse) {
  //     throw new Error('El usuario ya ha comprado este curso.');
  //   }
  
  //   const purchase = new Purchase();
  //   purchase.buyer = userId;
  //   purchase.course = courseId;
  
  //   // Guardar la nueva compra en la base de datos
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
