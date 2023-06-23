import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { hash, genSalt, compare } from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';



@Injectable()
export class AuthService {
  userModel: any;
  jwtService: any;
  constructor(
    private userService: UserService) {}


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
  async login(userObjectLogin:LoginAuthDto){
    const {email, password} = userObjectLogin;
      const findUser = await this.userModel.getUserByEmail({email});
      if(!findUser) throw new HttpException('User not Found', 404);

      const checkPassword = await compare(password, findUser.password);
      if(!checkPassword) throw new HttpException('Password invalid', 403);
      // ! add user role here for the admin guard
      const payload = {id:findUser.id, name:findUser.name}

      const token = await this.jwtService.sign()

      const data = {
        user:findUser,
        token,
      };
      return data;

}
/* 
async getCurrentUser(req: Request): Promise<User> {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    throw new UnauthorizedException('No token provided.');
  }

  try {
    const decodedToken = this.jwtService.verify(token);
    const userId = decodedToken.sub; // Assuming the user ID is stored in the 'sub' claim of the JWT
    // Fetch the user from the database based on the user ID
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid token.');
    }
    return user;
  } catch (error) {
    throw new UnauthorizedException('Invalid token.');
  }
}*/
} 