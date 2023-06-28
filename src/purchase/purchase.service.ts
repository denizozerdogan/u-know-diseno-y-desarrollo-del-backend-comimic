import { Injectable, NotFoundException } from '@nestjs/common';
import { Purchase } from './entities/purchase.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PurchaseService {
    constructor(
        @InjectRepository(Purchase) private purchaseRepository: Repository<Purchase>,
      ){}
 

  



}