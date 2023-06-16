import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository} from '@nestjs/typeorm'
import { User } from './entities/user.entity';
import { Repository } from 'typeorm'

@ApiTags('user')
@Injectable()
export class UserService {

  constructor (
    @InjectRepository (User) private userRepository: Repository <User>,
  ) {}
  
  create(createUserDto: CreateUserDto) {
    const { nombre, apellidos, saldo, password, email } = createUserDto;

    const newUser = this.userRepository.create({
      nombre,
      apellidos,
      saldo,
      password,
      email,
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date(),
    });

    return this.userRepository.save(newUser);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    
    user.nombre = updateUserDto.nombre;
    user.apellidos = updateUserDto.apellidos;
    user.saldo = updateUserDto.saldo;
    user.password = updateUserDto.password;
    user.email = updateUserDto.email;
    user.fecha_actualizacion = new Date();


    const updatedUser = await this.userRepository.save(user);

    return updatedUser;
  }


  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
