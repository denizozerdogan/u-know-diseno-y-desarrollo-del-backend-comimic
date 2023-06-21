import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';


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
    findOne: jest.fn().mockImplementation((id: number) => {
      const user = users.find((user: { id: number; }) => user.id === id);
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
    delete: jest.fn().mockImplementation((id: number) => {
      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex >= 0) {
        users.splice(userIndex, 1);
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    }),

  /* jest.fn().mockImplementation((id: number, updateUserDto: UpdateUserDto) => {
      const { password, bio } = updateUserDto;
      const user = users.find((user) => user.id === id);
    
      if (user) {
        const updatedUser = {
          ...user,
          password,
          bio,
        };
        Object.assign(user, updatedUser);
        return Promise.resolve(updatedUser); */

  /*  jest.fn().mockImplementation((id: number, updateUserDto: UpdateUserDto) => {
      const { password, bio } = updateUserDto;
      const user = users.find((user) => user.id === id);
  
      if (user) {
        user.password = password;
        user.bio = bio;
        return Promise.resolve(mockUserRepositoryService.save(user));
      } */
    }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepositoryService,
        }]
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

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
      updated_at: new Date (),
    };

    expect(await service.createUser(newUser)).toMatchObject({
      id: expect.any(Number),
    });
  });

  it('should return a list of all users', async () => {
    expect(await service.getUser()).toMatchObject({ users });
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



  /*  it('should update a user and return the updated user', async () => {
    const userId = 1;
    const updatedUserDto: UpdateUserDto = {
      password: 'newpassword',
      bio: 'Updated bio',
    };
    const expectedUpdatedUser = {
      id: userId,
      ...updatedUserDto,
    };
  
    const updatedUser = await service.updateUser(userId, updatedUserDto);
  
    expect(updatedUser).toMatchObject(expectedUpdatedUser);
  }); */

  /*it('should retrieve user by id and return the user with that id', async () => {
    const userId = 1;
    const expectedUser = {
      id: 1,
      name: "Yumi",
      surname: "Namie",
      wallet: 1000,
      password: "password1234",
      email: "yumi@example.com",
      bio: "I am Yumi",
      created_at: "2023-06-16",
      updated_at: "2023-06-16",
    };
    const user = await service.getUserById(userId);
    expect(user).toMatchObject(expectedUser);

  });
  it('should update a user and return the updated user', async () => {
    const userId = 1;
    const updatedUserDto: UpdateUserDto = {
      password: 'newpassword',
      bio: 'Updated bio',
    };
    const expectedUpdatedUser = {
      id: userId,
      ...updatedUserDto,
    };
  
    expect(await service.updateUser(userId, updatedUserDto)).toEqual(expectedUpdatedUser);
  });*/
});
