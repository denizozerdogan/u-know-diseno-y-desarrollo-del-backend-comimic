import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegistrerAuthDto } from './dto/register-auth.dto';
import { hash, genSalt } from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async encrypt(password: string): Promise<string> {
    try {
      const salt = await genSalt(10);
      return hash(password, salt);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async register(user: RegistrerAuthDto) {
    try {
      const hashedPassword = await this.encrypt(user.password);
    //   console.log(user, hashedPassword);

      const createUser = await this.userService.create({
        password: hashedPassword,
        nombre: '',
        email: ''
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