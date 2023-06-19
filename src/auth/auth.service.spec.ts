/* import { Test, TestingModule } from '@nestjs/testing';
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
}); */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { genSalt, hash } from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

describe('AuthService', () => {
  const users = []

  const mockAuthService = {
    encrypt: jest.fn().mockImplementation(async (password: string) => {
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);
      return hashedPassword;
    }),
    registerUser: jest.fn().mockImplementation((userObject: RegisterAuthDto) => {
      const newUser = {
        id: 1,
        ...RegisterAuthDto,
      };
      users.push(newUser);
      return Promise.resolve(newUser);
    }),
  };

  const mockUserService = {
    createUser: jest.fn().mockImplementation((createUserDto: CreateUserDto) => {
      const newUser = {
        id: 1,
        ...createUserDto,
      };
      users.push(newUser);
      return Promise.resolve(newUser);
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

  });

  it('should encrypt the password', async () => {
    const password = 'password123';
    const salt = 'salt';
    const hashedPassword = 'hashedPassword';

    jest.spyOn(genSalt, 'genSalt').mockResolvedValue(salt);
    jest.spyOn(hash, 'hash').mockResolvedValue(hashedPassword);

    const result = await mockAuthService.encrypt(password);

    expect(genSalt.genSalt).toHaveBeenCalledWith(10);
    expect(hash.hash).toHaveBeenCalledWith(password, salt);
    expect(result).toBe(hashedPassword);
  });
});
  /* it('should register a user and return the user object without the password', async () => {
    // Mock the dependencies or methods
    jest.spyOn(mockUserService, 'createUser').mockResolvedValueOnce({
      id: 1,
      name: 'Yumi',
      surname: 'Namie',
      wallet: 1000,
      password: 'password1234',
      email: 'yumi@example.com',
      bio: 'I am Yumi',
      created_at: new Date(),
      updated_at: new Date(),
    });

    jest.spyOn(mockAuthService, 'encrypt').mockResolvedValueOnce('hashedPassword');

    const userObject: RegisterAuthDto = {
      name: 'John',
      email: 'john@example.com',
      password: 'password123',
    };

    const result = await service.register(userObject);

    expect(result).toEqual({
      id: 1,
      name: 'Yumi',
      surname: 'Namie',
      wallet: 1000,
      password: 'password1234',
      email: 'yumi@example.com',
      bio: 'I am Yumi',
      created_at: new Date(),
      updated_at: new Date(),
    });
    expect(mockAuthService.registerUser).toHaveBeenCalledWith({
      id: 1,
      name: 'Yumi',
      surname: 'Namie',
      wallet: 1000,
      password: 'password1234',
      email: 'yumi@example.com',
      bio: 'I am Yumi',
      created_at: new Date(),
      updated_at: new Date(),
    });
    expect(mockAuthService.encrypt).toHaveBeenCalledWith('password123');
  });
}); */