import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm'; 
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';


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
      providers: [AuthService, {
        //class type that you are mocking (use mockUserService as UserService)
        provide: UserService,
        useValue: mockUserService,
      }], 
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
    //do same for other fields

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
  }
);
});