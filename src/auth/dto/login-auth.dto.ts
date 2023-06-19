import { ApiProperty } from '@nestjs/swagger';
import{IsEmail, IsNotEmpty, MaxLength, MinLength} from 'class-validator';

export class loginAuthDto {
     @ApiProperty ({example :'lisa@ejemplo.com', description: 'correo de lisa'})
    @IsNotEmpty()
    @IsEmail()
    email:string;

    @ApiProperty ({example :'password1234', description: 'contraseña de lisa'})
    @MinLength(4)
    @MaxLength(15)
    password: string;
}
