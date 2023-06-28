import { Controller, Get, Post, Body, Param, Delete, Req } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Course } from 'src/course/entities/course.entity';
import { User } from 'src/user/entities/user.entity';
import { Purchase } from './entities/purchase.entity';

@ApiBearerAuth()
@ApiTags('purchase')
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  // @Post('')
  // createPurchase(
  //   @Body() createPurchaseDto: CreatePurchaseDto,
  //   @Req() req: Request,
  // ): Promise<Purchase> {
  //   const userId: User = req['user']['userId'];
  //   // const course: Course = req['course']['courseId'];
  //   const courseId: number = createPurchaseDto.courseId;

  //   createPurchaseDto.userId = user.id;
   


  //   return this.purchaseService.makePurchase(createPurchaseDto, userId, courseId);
  // }
  @Post('')
createPurchase(
  @Body() createPurchaseDto: CreatePurchaseDto,
  @Req() req: Request,
): Promise<Purchase> {
  const userId: number = req['user']['userId'];
  const courseId: number = createPurchaseDto.courseId; 

  return this.purchaseService.makePurchase(userId, courseId);
}



  @Get()
  findAll() {
    return this.purchaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseService.remove(+id);
  }
}


//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updatePurchaseDto: UpdatePurchaseDto) {
//     return this.purchaseService.update(+id, updatePurchaseDto);
//   }