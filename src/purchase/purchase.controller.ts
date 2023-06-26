// import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, NotFoundException, Req, Res, UseGuards } from '@nestjs/common';
// import { PurchaseService } from './purchase.service';
// import { CreatePurchaseDto } from './dto/create-purchase.dto';
// import { UpdatePurchaseDto } from './dto/update-purchase.dto';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { Roles } from 'src/auth/roles.decorator';
// import { RolesGuard } from 'src/auth/roles.guard';
// import { Role } from 'src/user/entities/role.enum';
// import { User } from 'src/user/entities/user.entity';
// import { Purchase } from './entities/purchase.entity';

// @Controller('purchase')
// export class PurchaseController {
//   constructor(private readonly purchaseService: PurchaseService) {}

//   @Post()
//   @UseGuards(JwtAuthGuard)
//   async createPurchase(
//     @Body() createPurchaseDto: CreatePurchaseDto,
//     @Req() req: Request,
//   ): Promise<Purchase> {
//     const user: User = req['user']['userId'];
//     createPurchaseDto.Id = user.id;
//     return this.purchaseService.createPurchase(createPurchaseDto, user);
//   }

//   @Get('')
//   async findAll(@Res() response: Response) {
//     try {
//       const purchases = await this.purchaseService.findAll();
//       if (!purchases) {
//         throw new NotFoundException('No purchases found.');
//       }
//       return purchases;
//     } catch (error) {
//       throw new NotFoundException('No purchases found.');
//     }
//   }

//   @Get(':purchaseId')
//   async findOne(@Res() response: Response, @Param('purchaseId') purchaseId: string) {
//     try {
//       const purchase = await this.purchaseService.findOne(+purchaseId);

//       if (!purchase) {
//         return response.status(HttpStatus.NOT_FOUND).send(`Purchase ${purchaseId} not found.`);
//       }

//       return purchase;
//     } catch (error) {
//       return response.status(HttpStatus.NOT_FOUND).send(`Purchase ${purchaseId} not found.`);
//     }
//   }

//   @Patch(':purchaseId')
//   @UseGuards(JwtAuthGuard)
//   async update(@Param('purchaseId') purchaseId: string, @Body() updatePurchaseDto: UpdatePurchaseDto) {
//     try {
//       const updatedPurchase = await this.purchaseService.update(+purchaseId, updatePurchaseDto);
//       if (!updatedPurchase) {
//         throw new NotFoundException('Purchase not found.');
//       }
//       return updatedPurchase;
//     } catch (error) {
//       throw new Error('Failed to update the purchase.');
//     }
//   }

//   @Delete(':purchaseId')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.ADMIN)
//   async remove(@Param('purchaseId') purchaseId: string) {
//     try {
//       const deletedPurchase = await this.purchaseService.remove(+purchaseId);
//       if (deletedPurchase === undefined) {
//         throw new NotFoundException('Purchase not found.');
//       }
//       return deletedPurchase;
//     } catch (error) {
//       throw new NotFoundException('Purchase not found.');
//     }
//   }
// }