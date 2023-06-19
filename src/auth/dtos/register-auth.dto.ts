import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length, IsEmail } from "class-validator";


export class RegisterAuthDto {
    @ApiProperty({ example: 1 })
    id: number;
  
    @IsNotEmpty()
    @ApiProperty({ example: 'Yumi' })
    nombre: string;
  
    @IsNotEmpty()
    @ApiProperty({ example: 'Namie' })
    apellidos: string;
  
    @ApiProperty({ example: 1000 })
    saldo: number;
  
    @IsNotEmpty()
    @Length(8, 24)
    @ApiProperty({ example: 'password1234' })
    password: string;
  
    @IsEmail()
    @ApiProperty({ example: 'yumi@example.com' })
    email: string;
  
    @ApiProperty({
      example: 'Hello my name is Yumi, I am a rockstar fullstack developer',
    })
    bio: string;
  
    @ApiProperty({ example: '2023-06-16' })
    fecha_creacion: Date;
  
    @ApiProperty({ example: '2023-06-16' })
    fecha_actualizacion: Date;
}