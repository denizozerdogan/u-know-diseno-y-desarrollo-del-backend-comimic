import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user and return the user', async () => {
    const newUser: RegisterAuthDto = {
      id: 1,
      name: 'Diego',
      surname: 'Monsalve',
      wallet: 1000,
      password: 'password1234',
      email: 'diego@example.com',
      bio: 'I am Future Diegooo',
      created_at: new Date(2023 - 6 - 16),
      updated_at: new Date(2023 - 6 - 16),
    };

    const createdUser = { id: 1, ...newUser };

    jest.spyOn(mockUserService, 'createUser').mockResolvedValue(createdUser);

    const result = await controller.registerUser(newUser);

    expect(result).toEqual(createdUser);
    });
  });

