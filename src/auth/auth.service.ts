import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

  constructor(private userService: UserService) {}

  async encrypt(password: string): Promise<string> {
    try {
      const salt = await genSalt(10);
      return hash(password, salt);
    } catch (error) {
      throw new InternalServerErrorException('Error al encriptar la contraseña');
    }
  }

  async register(userObject: RegisterAuthDto) {
    try {
      if (!userObject.email || !userObject.password) {
        throw new BadRequestException('El correo electrónico y la contraseña son requeridos');
      }

      const hashedPassword = await this.encrypt(userObject.password);
      const createUser = await this.userService.createUser({
        password: hashedPassword,
        ...userObject,
      });
  
      const { password, ...rest } = createUser;

      

      return rest;
    } catch (error) {
      
      throw new InternalServerErrorException('Error al registrar el usuario');
    }
  }
}

