import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

const users: any = [
  {
    id: 1,
    name: 'Yumi',
    surname: 'Namie',
    wallet: 1000,
    password: 'password1234',
    email: 'yumi@example.com',
    bio: 'I am Yumi',
    created_at: new Date(2023, 7, 16),
    updated_at: new Date(2023, 7, 16),
  },
];

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    save: jest.fn().mockImplementation((createUserDto: CreateUserDto) => {
      const newUser = {
        id: 2,
        ...createUserDto,
      };
      users.push(newUser);
      return Promise.resolve(newUser);
    }),
    find: jest.fn().mockImplementation(() => Promise.resolve({ users })),
    findOne: jest.fn().mockImplementation((id: number) => {
      const user = users.find((user) => user.id === id);
      return Promise.resolve(user);
    }),
    update: jest
      .fn()
      .mockImplementation((id: number, updateUserDto: UpdateUserDto) => {
        const updatedUser = {
          id,
          ...updateUserDto,
        };
        return Promise.resolve(updatedUser);
    }),
    // delete: jest.fn().mockImplementation((id: number) => {
    //   const userIndex = users.findIndex((user) => user.id === id);
    //   if (userIndex >= 0) {
    //     users.splice(userIndex, 1);
    //     return Promise.resolve(true);
    //   } else {
    //     return Promise.resolve(false);
    //   }
    //}),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService,{
        provide: getRepositoryToken(User),
        useValue: mockUserRepository,
      }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
