import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { hash, genSalt } from 'bcrypt';
import { UserService } from '../user/user.service';



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


      const hashedPassword = await this.encrypt(userObject.password);
      const createUser = await this.userService.createUser({
        ...userObject,
        password: hashedPassword,
      });
      
      const { password, ...rest } = createUser;

      return rest;
    } catch (error) {
      if (error?.erno == 1062) {
        throw ConflictException;
    }
  }
}
}