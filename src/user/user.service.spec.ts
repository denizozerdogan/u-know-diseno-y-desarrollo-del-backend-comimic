import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';


//Mock data array
const users: any = [
  {
    id: 1,
    nombre: "Yumi",
    apellidos: "Namie",
    saldo: 1000,
    password: "password1234",
    email: "yumi@example.com",
    bio: "I am Yumi",
    fecha_creacion: new Date (2023-6-16),
    fecha_actualizacion: new Date (2023-6-16),
  }
]

describe('UserService', () => {
  let service: UserService;

  const mockUserRepositoryService = {
    save: jest.fn().mockImplementation((createUserDto: CreateUserDto) => {
      const newUser = {
        id: 2,
        ...createUserDto,
      }
      users.push(newUser);
      return Promise.resolve(newUser);
    }),
    find: jest.fn().mockImplementation(() => Promise.resolve({users})),
    findOne: jest.fn().mockImplementation((id: number) => {
      const user = users.find((user) => user.id === id);
      return Promise.resolve(user);
    }),
    update: jest.fn().mockImplementation((id: number, updateUserDto: UpdateUserDto) => {
      const { password, bio } = updateUserDto;
      const user = users.find((user) => user.id === id);
    
      if (user) {
        const updatedUser = {
          ...user,
          password,
          bio,
        };
        Object.assign(user, updatedUser);
        return Promise.resolve(updatedUser);
      }
    
   /*  jest.fn().mockImplementation((id: number, updateUserDto: UpdateUserDto) => {
      const { password, bio } = updateUserDto;
      const user = users.find((user) => user.id === id);
  
      if (user) {
        user.password = password;
        user.bio = bio;
        return Promise.resolve(mockUserRepositoryService.save(user));
      } */
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService,
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
      nombre: "Diego",
      apellidos: "Monsalve",
      saldo: 1000,
      password: "password1234",
      email: "diego@example.com",
      bio: "I am Future Diegooo",
      fecha_creacion: new Date (2023-6-16),
      fecha_actualizacion: new Date (2023-6-16),
    }

    expect(await service.createUser(newUser)).toMatchObject({
      id: expect.any(Number),
    });
  });

  it('should return a list of all users', async () => {
    expect(await service.getUser()).toMatchObject({users})
  });

  it('should retrieve user by id and return the user with that id', async () => {
    
    const expectedUser = {
    id: 1,
    nombre: "Yumi",
    apellidos: "Namie",
    saldo: 1000,
    password: "password1234",
    email: "yumi@example.com",
    bio: "I am Yumi",
    fecha_creacion: new Date (2023-6-16),
    fecha_actualizacion: new Date (2023-6-16),
    };  

    expect(await service.getUserById(1)).toMatchObject(expectedUser);
  });
  
  it('should update a user and return the updated user', async () => {
  const userId = 1;
  const updateUserDto: UpdateUserDto = {
    password: 'newpassword',
    bio: 'Updated bio',
  };

  const existingUser = {
    id: 1,
    nombre: "Yumi",
    apellidos: "Namie",
    saldo: 1000,
    password: "password1234",
    email: "yumi@example.com",
    bio: "I am Yumi",
    fecha_creacion: new Date (2023-6-16),
    fecha_actualizacion: new Date (),
  };

  const updatedUser = {
    id: userId,
    ...existingUser,
    ...updateUserDto,
    fecha_actualizacion: expect.any(Date),

  };
  const result = await service.updateUser(userId, updateUserDto);

  expect(result).toEqual(updatedUser);
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
      nombre: "Yumi",
      apellidos: "Namie",
      saldo: 1000,
      password: "password1234",
      email: "yumi@example.com",
      bio: "I am Yumi",
      fecha_creacion: "2023-06-16",
      fecha_actualizacion: "2023-06-16",
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
})
