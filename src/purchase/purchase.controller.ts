import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Course } from 'src/course/entities/course.entity';
import { User } from 'src/user/entities/user.entity';
import { Purchase } from './entities/purchase.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/user/entities/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiBearerAuth()
@ApiTags('purchase')
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Post('')
  async createPurchase(
    @Body() createPurchaseDto: CreatePurchaseDto,
    @Req() req: Request, 
  ): Promise<Purchase> {
    const user: User = req['user'];
    createPurchaseDto.userId = user.id; 
    return this.purchaseService.makePurchase(createPurchaseDto, user);
  }

  @Get(':courseId/count')
  async countCoursePurchases(@Param('courseId') courseId: number): Promise<{ count: number }> {
    const count = await this.purchaseService.countCoursePurchases(courseId);
    return { count };
  }

  //User can see all courses purchased
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Get('user-courses')
    async getUserCourses(@Req() req: Request): Promise<Course[]> {
    const user: User = req['user'];
    return this.purchaseService.getUserPurchasedCourses(user);
  }

  //User can choose see one course purchased
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Get('user-courses/:courseId')
  async getUserPurchase(
    @Req() req: Request,
    @Param('courseId') courseId: number,
  ): Promise<Course> {
    const user: User = req['user'];
    return this.purchaseService.getUserPurchasedCourse(user, courseId);
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
