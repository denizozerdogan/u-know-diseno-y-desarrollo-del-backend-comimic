import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Entity()
export class User {
  @ApiProperty({ description: 'Primary key as User ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'First name of User', example: 'Yumi' })
  @Column()
  nombre: string;

  @ApiProperty({ description: 'Last name of User', example: 'Namie' })
  @Column()
  apellidos: string;

  @ApiProperty({ description: 'The Wallet of the User', example: 1000 })
  @Column({default: 1000})
  saldo: number;

  @ApiProperty({ description: 'Password of User', example: 'password1234' })
  @Column()
  password: string;

  @ApiProperty({ description: 'Email of User', example: 'yumi@example.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Bio of User', example: 'Hello my name is Yumi, I am a rockstar fullstack developer' })
  @Column({type: 'text'})
  bio: string;

  @ApiProperty({
    description: 'Registration date of User',
    example: '2023-06-16',
  })
  @Column()
  fecha_creacion: Date;

  @ApiProperty({ description: 'Update date of User', example: '2023-06-16' })
  @Column()
  fecha_actualizacion: Date;
}
