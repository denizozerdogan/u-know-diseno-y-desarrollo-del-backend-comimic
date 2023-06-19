import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @ApiProperty({ example: 'Yumi' })
  nombre: string;

  @ApiProperty({ example: 'Namie' })
  apellidos?: string;


  @ApiProperty({ example: 1000 })
  saldo?: number;

  @ApiProperty({ example: 'password1234' })
  password: string;

  @ApiProperty({ example: 'yumi@example.com' })
  email: string;

  @ApiProperty({ example: 'Hello my name is Yumi, I am a rockstar fullstack developer' })
  bio?: string;
}
