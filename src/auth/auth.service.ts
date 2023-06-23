import {
  ConflictException,
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






@Injectable()
export class AuthService {
  
  constructor(private readonly userService: UserService,
    private jwtService: JwtService) {}



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
// async validateUser(loggedUser: LoginDto) {
//   try {
//     const user = await this.userService.findOneByEmail(loggedUser.email);
//     //verificar la password
//     if (await this.passwordVerify(loggedUser.password, user.password))
//       return {
//         accessToken: await this.jwtService.signAsync({
//           email: loggedUser.email,
//         }), //'esto es un token', //to-do: generación del token
//       };

//     throw new UnauthorizedException();
//   } catch (error) {
//     throw error;
//   }
// }




async login(userObjectLogin: LoginAuthDto) {
  const { email, password } = userObjectLogin;
  const findUser = await this.userService.getUserByEmail(email);
  if (!findUser) throw new HttpException('User not Found', 404);

  const checkPassword = await compare(password, findUser.password);
  if (!checkPassword) throw new HttpException('Password invalid', 403);

  const payload = { id: findUser.id, name: findUser.name };
  const token = this.jwtService.sign(payload);

  const { password: _, ...userWithoutPassword } = findUser; // Excluir el campo "password" en la desestructuración

  const data = {
    user: userWithoutPassword, // Utilizar el objeto sin el campo "password"
    token,
  };

  return data;
}




//   async login(userObjectLogin:LoginAuthDto){
//     const {email, password} = userObjectLogin;
//       const findUser = await this.userService.getUserByEmail(email);
//       if(!findUser) throw new HttpException('User not Found', 404);

//       const checkPassword = await compare(password, findUser.password);
//       if(!checkPassword) throw new HttpException('Password invalid', 403);
      
//       const payload = {id:findUser.id, name:findUser.name}

// const token = this.jwtService.sign(payload)



//       const data = {
//         user:findUser,
//         token,
//       };
//       return data;

// }
}