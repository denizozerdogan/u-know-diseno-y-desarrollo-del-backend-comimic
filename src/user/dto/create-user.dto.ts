import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString, Length } from 'class-validator';
import * as bcrypt from 'bcrypt'
import { BeforeInsert } from 'typeorm';

export class CreateUserDto {
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

  @ApiProperty({ example: 'Hello my name is Yumi, I am a rockstar fullstack developer' })
  bio: string;

  @ApiProperty({ example: '2023-06-16' })
  fecha_creacion: Date;

  @ApiProperty({ example: '2023-06-16' })
  fecha_actualizacion: Date;

  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt)
  }
}
