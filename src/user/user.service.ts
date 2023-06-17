import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity';
import { Repository } from 'typeorm'

@ApiTags('user')
@Injectable()
export class UserService {

  constructor (
    @InjectRepository (User) private userRepository: Repository <User>,
  ) {}
  
  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  //findAll
  async getUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  //findOne
  async getUserById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  //update
  updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { password, bio } = updateUserDto;
    
    return this.userRepository.createQueryBuilder().update(User).set({password, bio}).where('id = :id', { id }).execute()
  };

  //remove
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
