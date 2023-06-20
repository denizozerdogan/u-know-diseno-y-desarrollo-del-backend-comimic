import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@ApiTags('user')
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
      if (existingUser) {
      throw new BadRequestException('User with the same email already exists')      }
  
      const userCreated = await this.userRepository.save(createUserDto);
      console.log(userCreated);
      return userCreated;
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  /* async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const userCreated = await this.userRepository.save(createUserDto);
      console.log(userCreated);
      return userCreated;
    } catch (error) {
      throw new BadRequestException()
    }
  }  */

  //findAll
  async getUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  //findOne
  async getUserById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

 /*  getUserByEmail(email: string) {
    return this.userRepository.findOne({where: {email}}) */

    getUserByEmail(email: string) {
    if (!email) {
      throw new NotFoundException('Email not found');
    }
  
    return this.userRepository.findOne({where: {email}})
  } 

  //update
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const toUpdate = await this.userRepository.findOne({ where: { id } });

    if (toUpdate) {
      Object.assign(toUpdate, updateUserDto);
      return this.userRepository.save(toUpdate);
    }
  }

  removeUser(id: number) {
    return this.userRepository.delete(id)
  };
}
