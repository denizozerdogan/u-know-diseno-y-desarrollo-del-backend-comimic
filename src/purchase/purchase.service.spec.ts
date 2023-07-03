import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseService } from './purchase.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from '../course/entities/course.entity';
import { Purchase } from './entities/purchase.entity';

  describe('PurchaseService', () => {
   let service: PurchaseService;

   const mockCourseRepository = {}
   const mockPurchaseRepository = {}

   beforeEach(async () => {
     const module: TestingModule = await Test.createTestingModule({
       providers: [PurchaseService,
        {
            provide: getRepositoryToken(Course),
            useValue: mockCourseRepository,
        },
        {
            provide: getRepositoryToken(Purchase),
            useValue: mockPurchaseRepository,
        },
    ],
     }).compile();

     service = module.get<PurchaseService>(PurchaseService);
   });

   it('should be defined', () => {
     expect(service).toBeDefined();
   });
 });
