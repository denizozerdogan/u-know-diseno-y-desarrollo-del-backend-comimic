import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
//Mock data array
const users: any = [
  {
    id: 1,
    nombre: 'Yumi',
    apellidos: 'Namie',
    saldo: 1000,
    password: 'password1234',
    email: 'yumi@example.com',
    bio: 'I am Yumi',
    fecha_creacion: '2023-06-16',
    fecha_actualizacion: '2023-06-16',
  },
];

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn().mockImplementation((userObject: RegisterAuthDto) => {
      const newUser = {
        id: 2,
        ...RegisterAuthDto,
      };
      users.push(newUser);
      return Promise.resolve(newUser);
    }),
  };

  const mockUserService = {
    createUser: jest.fn().mockImplementation((createUserDto: CreateUserDto) => {
      const newUser = {
        id: 2,
        ...createUserDto,
      };
      users.push(newUser);
      return Promise.resolve(newUser);
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user and return the user', async () => {
    const newUser: RegisterAuthDto = {
      id: 2,
      nombre: 'Diego',
      apellidos: 'Monsalve',
      saldo: 1000,
      password: 'password1234',
      email: 'diego@example.com',
      bio: 'I am Future Diegooo',
      fecha_creacion: new Date(2023 - 6 - 16),
      fecha_actualizacion: new Date(2023 - 6 - 16),
    };

    const createdUser = { id: 1, ...newUser };

    jest.spyOn(mockUserService, 'createUser').mockResolvedValue(createdUser);

    const result = await controller.registerUser(newUser);

    expect(result).toEqual(createdUser);
    expect(mockUserService.createUser).toHaveBeenCalledWith(newUser);
    });
  });

