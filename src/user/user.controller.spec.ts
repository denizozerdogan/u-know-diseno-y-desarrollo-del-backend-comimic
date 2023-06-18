import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
    fecha_creacion: "2023-06-16",
    fecha_actualizacion: "2023-06-16",
  }
]

describe('UserController', () => {
  let controller: UserController;

  //mock for UserService

  const mockUserService = {
    createUser: jest.fn().mockImplementation((createUserDto: CreateUserDto) => {
      const newUser = {
        id: 2,
        ...createUserDto,
      }
      users.push(newUser);
      return Promise.resolve(newUser);
    }),
    getUser: jest.fn().mockImplementation(() => Promise.resolve({users})),
    getUserById: jest.fn().mockImplementation((id: number) => {
      const user = users.find((user) => user.id === id);
      return Promise.resolve(user);
    }),
    updateUser: jest.fn().mockImplementation((id: number, updateUserDto: UpdateUserDto) => {
      const updatedUser = {
        id,
        ...updateUserDto,
      };
      return Promise.resolve(updatedUser);
    }),
   
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).overrideProvider(UserService).useValue(mockUserService).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    expect(await controller.create(newUser)).toMatchObject({
      id: expect.any(Number),
    });
  });

  it('should return a list of all users', async () => {
    expect(await controller.findAll()).toMatchObject({users})
  });

  it('should retrieve user by id and return the user with that id', async () => {
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
    expect(await controller.findOne(userId)).toMatchObject(expectedUser)
  });

  it('should update the user bio and password', async () => {
    const userId = 1;
    const updateUserDto: UpdateUserDto = {
      password: 'newpassword',
      bio: 'Updated bio',
    };
    const expectedUpdatedUser = {
      id: userId,
      ...updateUserDto,
    };
    expect(await controller.update(userId, updateUserDto)).toEqual(expectedUpdatedUser);
  });
});
