import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm'; 
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';


const users: any = [
  {
    id: 1,
    name: 'Victor',
    surname: 'Eiji',
    wallet: 1000,
    password: 'password1234',
    email: 'Eiji@example.com',
    bio: 'I am Eiji',
    created_at: new Date(2023, 7, 16),
    updated_at: new Date(2023, 7, 16),
  },
];

describe('AuthService', () => {
  let authService: AuthService;

  const mockJwtService = {};

  const mockUserService = {
    //should have all the methods from service and use them in the test
    //createUser (from userService)
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
      providers: [AuthService,
        {
        //class type that you are mocking (use mockUserService as UserService)
        provide: UserService,
        useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
    ], 
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  //test check if the new user id is in the array and if all the properties are correct (register)
  it('should save the user when register function is called', async () => {
    
    const user1 = {
      id: 2,
      name: 'Yumi',
      surname: 'Namie',
      wallet: 1000,
      password: 'password1234',
      email: 'yumi@example.com',
      bio: 'I am Yumi',
      created_at: new Date(2023, 7, 16),
      updated_at: new Date(2023, 7, 16),
    };
    const newUser = await authService.register(user1);
   
    // as your mock always save new users with an id =2, now you should find an user object with id = 2
    let savedUser = users.find(user => user.id === 2);

    // check if all the fields of the found user are correct, meaning that they are the same as the user that you passed in the parameter.
    expect(savedUser.name).toEqual(user1.name);
    expect(savedUser.surname).toEqual(user1.surname);
    expect(savedUser.wallet).toEqual(user1.wallet);
    expect(savedUser.email).toEqual(user1.email);
   
    // check if the returned new user is the correct one, meaning that all the fields values are the same as the values that you passed in the parameter.
    expect(newUser).toEqual( {
      "bio": "I am Yumi", 
      "created_at": new Date(2023, 7, 16), 
      "email": "yumi@example.com", 
      "id": 2, 
      "name": "Yumi", 
      "surname": "Namie", 
      "updated_at": new Date(2023, 7, 16),
      "wallet": 1000});
    // do same for other fields
  });

  it('should encrypt the password when register function is called', async () => {
    const user = {
      id: 2,
      name: 'Yumi',
      surname: 'Namie',
      wallet: 1000,
      password: 'password1234',
      email: 'yumi@example.com',
      bio: 'I am Yumi',
      created_at: new Date(2023, 7, 16),
      updated_at: new Date(2023, 7, 16),
    };
  
    const encryptedPassword = 'hashedpassword'; // Replace with the expected hashed password
  
    // Mock the encrypt function to return the expected hashed password
    jest.spyOn(authService, 'encrypt').mockResolvedValue(encryptedPassword);
  
    // Call the register function
    const newUser = await authService.register(user);
  
    // Ensure that the encrypt function was called with the correct password
    expect(authService.encrypt).toHaveBeenCalledWith(user.password);
  
  });

  it('should throw an exception for duplicate email during registration', async () => {
    const user = {
      id: 2,
      name: 'Yumi',
      surname: 'Namie',
      wallet: 1000,
      password: 'password1234',
      email: 'yumi@example.com',
      bio: 'I am Yumi',
      created_at: new Date(2023, 7, 16),
      updated_at: new Date(2023, 7, 16),
    };
  
    // Mock the createUser function to throw an exception with status code 409
    jest.spyOn(mockUserService, 'createUser').mockRejectedValue({ status: 409 });
  
    // Call the register function and expect it to throw an exception with status code 409
    await expect(authService.register(user)).rejects.toThrow(HttpException);
    await expect(authService.register(user)).rejects.toHaveProperty('status', 409);
  });

  it('should throw an exception for internal server error during registration', async () => {
    const user = {
      id: 2,
      name: 'Yumi',
      surname: 'Namie',
      wallet: 1000,
      password: 'password1234',
      email: 'yumi@example.com',
      bio: 'I am Yumi',
      created_at: new Date(2023, 7, 16),
      updated_at: new Date(2023, 7, 16),
    };
  
    // Mock the createUser function to throw a generic error
    jest.spyOn(mockUserService, 'createUser').mockRejectedValue(new Error('Internal Server Error'));
  
    // Call the register function and expect it to throw an exception with status code 500
    await expect(authService.register(user)).rejects.toThrow(HttpException);
  });

});