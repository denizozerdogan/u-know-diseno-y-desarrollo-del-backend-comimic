import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { error } from 'console';




@ApiTags('user')
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const userCreated = await this.userRepository.save(createUserDto);
      return userCreated;
    } catch (error) {
      //console.error(error);
      throw new Error('Failed to create user');
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
    try {
      return this.userRepository.find();
    }catch (error){
      throw new ForbiddenException();
    }
    
  }

  //findOne
  /* async getUserById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
} */
async getUserById(id: number): Promise<User> {
  try {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  } catch (error) {
    //console.error(error);
    throw new Error('Failed to get user');
  }
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
    try {
      const toUpdate = await this.userRepository.findOne({ where: { id } });
  
      if (!toUpdate) {
        throw new NotFoundException;
      }
  
      Object.assign(toUpdate, updateUserDto);
  
      return await this.userRepository.save(toUpdate);
    } catch (error) {
      //console.error(error);
      throw new Error('Failed to update user');
    }
  }

  //delete
  async removeUser(id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id } });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const result = await this.userRepository.delete(id);
  
    if (result.affected === 0) {
      throw new InternalServerErrorException('Failed to delete user');
    }
  
    return true;
  }

 
}

  //delete
  // async removeUser(id: number): Promise<void> {
  //   try {
  //     const deletionResult = await this.userRepository.delete(id);
  //     if (deletionResult.affected === 0) {
  //       throw new Error('User not found'); // Throw an exception if no user was deleted
  //     }
  //   } catch (error) {
  //     // Handle the error appropriately
  //     console.error(error);
  //     throw new Error('Failed to delete user'); // Throw an exception or return an error response
  //   }
  // };

    // async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User | undefined> {
  //   const { password, bio } = updateUserDto;
  //   const user = await this.userRepository.findOne({ where: { id } });
  //   if (user) {
  //     user.password = password;
  //     user.bio = bio;
  //     return this.userRepository.save(user);
  //   }

  //   return undefined;
  // }

  // updateUser(id: number, updateUserDto: UpdateUserDto) {
  //   const { password, bio } = updateUserDto;

  //   return this.userRepository.createQueryBuilder().update(User).set({password, bio}).where('id = :id', { id }).execute()
  // };