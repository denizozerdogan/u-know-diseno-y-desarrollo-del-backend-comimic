import { PartialType } from '@nestjs/swagger';
import { loginAuthDto } from './login-auth.dto';
import{IsEmail, IsNotEmpty, MaxLength, MinLength, isNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrerAuthDto extends PartialType(loginAuthDto) {
   [x: string]: string;
   @ApiProperty ({example :'lisa', description: 'nombre de la usuaria'})
    @IsNotEmpty()
    nombre:string;

}
