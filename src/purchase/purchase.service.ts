import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Purchase } from './entities/purchase.entity';
import { User } from 'src/user/entities/user.entity';

// @Injectable()
// export class PurchaseService {
//   private purchases: Purchase[] = [];

//   async createPurchase(createPurchaseDto: CreatePurchaseDto, user: User): Promise<Purchase> {
//     // Lógica para crear una nueva compra
//     const newPurchase: Purchase = {
//       id: Math.floor(Math.random() * 1000), // Genera un número aleatorio entre 0 y 999
//       user: createPurchaseDto.Id,
//       // ... mapeo de otros datos del DTO a la entidad Purchase
//     };
//     this.purchases.push(newPurchase);
//     return newPurchase;
//   }

//   async findAll(): Promise<Purchase[]> {
//     // Lógica para obtener todas las compras
//     return this.purchases;
//   }

//   async findOne(purchaseId: number): Promise<Purchase> {
//     // Lógica para obtener una compra por su ID
//     const purchase = this.purchases.find((p) => p.id === purchaseId);
//     if (!purchase) {
//       throw new NotFoundException('Purchase not found.');
//     }
//     return purchase;
//   }

//   async update(purchaseId: number, updatePurchaseDto: UpdatePurchaseDto): Promise<Purchase> {
//     // Lógica para actualizar una compra existente
//     const purchase = await this.findOne(purchaseId);
//     // Actualizar los campos relevantes de la compra con los datos del DTO
//     // ...
//     return purchase;
//   }

//   async remove(purchaseId: number): Promise<Purchase> {
//     // Lógica para eliminar una compra existente
//     const purchaseIndex = this.purchases.findIndex((p) => p.id === purchaseId);
//     if (purchaseIndex === -1) {
//       throw new NotFoundException('Purchase not found.');
//     }
//     const deletedPurchase = this.purchases.splice(purchaseIndex, 1)[0];
//     return deletedPurchase;
//   }
// }