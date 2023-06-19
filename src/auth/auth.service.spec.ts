import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service'; 

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService], 
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});




















/* import { Test, TestingModule } from '@nestjs/testing';
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
}); */
  /* it('should register a user and return the user object without the password', async () => {
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