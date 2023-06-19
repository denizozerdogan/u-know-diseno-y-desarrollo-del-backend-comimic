import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

@ApiTags('user')
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellidos: string;

  @Column({ default: 1000 })
  saldo: number;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'text' })
  bio: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  fecha_actualizacion: Date;

}
