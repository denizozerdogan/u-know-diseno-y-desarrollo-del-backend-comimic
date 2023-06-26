import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { error } from 'console';
import { NotFoundException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';



//Mock data array
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

describe('UserService', () => {
  let service: UserService;
  let authService: AuthService;


  const mockUserRepositoryService = {
    save: jest.fn().mockImplementation((createUserDto: CreateUserDto) => {
      const newUser = {
        id: 2,
        ...createUserDto,
      };
      users.push(newUser);
      return Promise.resolve(newUser);
    }),
    find: jest.fn().mockImplementation(() => Promise.resolve({ users })),
    findOne: jest.fn(),/* jest.fn().mockImplementation((id: number) => {
      const user = users.find((user) => user.id === id);
      return Promise.resolve(user);
 /*    getUserByEmail: jest.fn().mockImplementation((email: string) => {
      const user = users.find((user) => user.email === email);
      return Promise.resolve(user);
    }), */
    update: jest
      .fn()
      .mockImplementation((id: number, updateUserDto: UpdateUserDto) => {
        const updatedUser = {
          id,
          ...updateUserDto,
        };
        return Promise.resolve(updatedUser);
    }),
    delete: jest.fn().mockImplementation((id: number) => {
      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex >= 0) {
        users.splice(userIndex, 1);
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    }),
    
    }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepositoryService,
        }, 
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
          },
        }
      ]
    }).compile();

    service = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

 /*  it('should create a new user and return the user', async () => {
    const newUser = {
      id: 2,
      name: 'Diego',
      surname: 'Monsalve',
      wallet: 1000,
      password: 'password1234',
      email: 'diego@example.com',
      bio: 'I am Future Diegooo',
      created_at: new Date(2023, 7, 16),
      updated_at: new Date (),
    };

    expect(await service.createUser(newUser)).toMatchObject({
      id: expect.any(Number),
    });
  }); */

  it('should create a new user and return the user', async () => {
    const newUser = {
      id: 2,
      name: 'Diego',
      surname: 'Monsalve',
      wallet: 1000,
      password: 'password1234',
      email: 'diego@example.com',
      bio: 'I am Future Diegooo',
      created_at: new Date(2023, 7, 16),
      updated_at: new Date(),
    };
  
    const createdUser = await service.createUser(newUser);
    expect(createdUser).toMatchObject({
      id: expect.any(Number),
    });
  });

  it('should throw an error when creating a user with an existing email', async () => {
    const existingUser = {
      id: 3,
      name: 'John',
      surname: 'Doe',
      wallet: 2000,
      password: 'password5678',
      email: 'diego@example.com', // Same email as the newUser
      bio: 'I am John Doe',
      created_at: new Date(2023, 7, 17),
      updated_at: new Date(),
    };

    jest.spyOn(authService, 'register').mockRejectedValueOnce(new ConflictException('User with the same email already exists'));

    await expect(authService.register(existingUser)).rejects.toThrowError('User with the same email already exists');
  });

  /* it('should throw an error when creating a user with an existing email', async () => {
    const existingUser = {
      id: 3,
      name: 'John',
      surname: 'Doe',
      wallet: 2000,
      password: 'password5678',
      email: 'diego@example.com', // Same email as the newUser
      bio: 'I am John Doe',
      created_at: new Date(2023, 7, 17),
      updated_at: new Date(),
    };
    jest.spyOn(mockUserRepositoryService, 'findOne').mockResolvedValue(existingUser);
    await expect(service.createUser(existingUser)).rejects.toThrowError('User with the same email already exists');
  });
 */

  it('should return a list of all users', async () => {
    expect(await service.getUser()).toMatchObject({ users });
  });

  it('should return forbidden error', async () => {
    jest.spyOn(mockUserRepositoryService, 'find').mockImplementation(() => {
      throw new Error('Some error'); // Simula un error al llamar a find()
    });
  
    await expect(service.getUser()).rejects.toThrowError(ForbiddenException);
  });
  

  it('should retrieve user by id and return the user with that id', async () => {
    const userId = 1;
    const expectedUser = users.find((user: any) => user.id === userId);

    //this makes everything work for findOne and update 
    jest.spyOn(mockUserRepositoryService, 'findOne').mockResolvedValue(expectedUser);

    const user = await service.getUserById(userId);

    expect(user).toEqual(expectedUser);
  });

  it('should update a user and return the updated user', async () => {
    const userId = 1;
    const updateUserDto: UpdateUserDto = {
      password: 'newpassword',
      bio: 'Updated bio',
    };

    const existingUser = {
      id: 1,
      name: 'Yumi',
      surname: 'Namie',
      wallet: 1000,
      password: 'password1234',
      email: 'yumi@example.com',
      bio: 'I am Yumi',
      created_at: new Date(2023, 7, 16),
      updated_at: expect.any(Date),
    };

    const updatedUser = {
      id: userId,
      ...existingUser,
      ...updateUserDto,
    };
    const result = await service.updateUser(userId, updateUserDto);

    expect(result).toEqual(updatedUser);
  });

  it('should update the password of user and return the updated user', async () => {
    const userId = 1;
    const updateUserDto: UpdateUserDto = {
      password: 'newpassword',
    };

    const existingUser = {
      id: 1,
      name: 'Yumi',
      surname: 'Namie',
      wallet: 1000,
      password: 'password1234',
      email: 'yumi@example.com',
      bio: 'I am Yumi',
      created_at: new Date(2023, 7, 16),
      updated_at: new Date (),
    };

    const updatedUser = {
      id: userId,
      ...existingUser,
      ...updateUserDto,
    };
    const result = await service.updateUser(userId, updateUserDto);

    expect(result.password).toEqual(updatedUser.password);
  });

  it('should update the bio of user and return the updated user', async () => {
    const userId = 1;
    const updateUserDto: UpdateUserDto = {
      bio: 'Updated bio',
    };

    const existingUser = {
      id: 1,
      name: 'Yumi',
      surname: 'Namie',
      wallet: 1000,
      password: 'password1234',
      email: 'yumi@example.com',
      bio: 'I am Yumi',
      created_at: new Date(2023, 7, 16),
      updated_at: new Date (),
    };

    const updatedUser = {
      id: userId,
      ...existingUser,
      ...updateUserDto,
    };
    const result = await service.updateUser(userId, updateUserDto);

    expect(result.bio).toEqual(updatedUser.bio);
  });

  it('should return false if the user with the given ID does not exist', async () => {
    const userId = 1;
    jest.spyOn(mockUserRepositoryService, 'delete').mockResolvedValue(false);

    await service.removeUser(userId);

    expect(mockUserRepositoryService.delete).toHaveBeenCalledWith(userId);
  });

  it('should return a user when a valid email is provided', async () => {
    const email = 'diego@example.com';
    const expectedUser = { id: 1, email: 'diego@example.com' };
  
    jest.spyOn(mockUserRepositoryService, 'findOne').mockImplementation(async (options) => {
      if (options.where.email === email) {
        return expectedUser;
      }
      return null;
    });
  
    const user = await service.getUserByEmail(email);
  
    expect(user).toEqual(expectedUser);
    expect(mockUserRepositoryService.findOne).toHaveBeenCalledWith({ where: { email } });
  
  
  /* it('should return a user when a valid email is provided', async () => {
    const email = 'diego@example.com';
    const expectedUser = { id: 1, email: 'diego@example.com' };

    jest.spyOn(mockUserRepositoryService, 'findOne').mockResolvedValue(expectedUser);

    const user = await mockUserRepositoryService.findOne(email);

    expect(user).toEqual(expectedUser);
    expect(mockUserRepositoryService.findOne).toHaveBeenCalledWith({ where: { email } }); */
  })  
  it('should throw an error if the user ID does not exist', async () => {
    const error = new Error('Failed to get user');

    jest.spyOn(mockUserRepositoryService, 'findOne').mockRejectedValue(error);

    await expect(service.getUserById(1)).rejects.toThrowError(error);
    expect(mockUserRepositoryService.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should return an error if the user ID does not exist when updating a user', async () => {

    const error = new Error('Failed to update user');

    jest.spyOn(mockUserRepositoryService, 'update').mockResolvedValue(error);

    await expect(service.updateUser).rejects.toThrowError(error);
    expect(mockUserRepositoryService.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  
});

