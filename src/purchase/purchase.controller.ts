import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Course } from '../course/entities/course.entity';
import { User } from '../user/entities/user.entity';
import { Purchase } from './entities/purchase.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('purchase')
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createPurchase(
    @Body() createPurchaseDto: CreatePurchaseDto,
    @Req() req: Request, 
  ): Promise<Purchase> {
    const user: User = req['user']['userId'];
    createPurchaseDto.userId = user; 
    return this.purchaseService.makePurchase(createPurchaseDto, user);
  }

  @Get(':courseId/count')
  async countCoursePurchases(@Param('courseId') courseId: number): Promise<{ count: number }> {
    const count = await this.purchaseService.countCoursePurchases(courseId);
    return { count };
  }


  @Get()
  findAll() {
    return this.purchaseService.findAll();
  }

}

/*   @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseService.remove(+id);
  }
} */


//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updatePurchaseDto: UpdatePurchaseDto) {
//     return this.purchaseService.update(+id, updatePurchaseDto);
//   }
