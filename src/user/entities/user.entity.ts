import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('user')
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ default: 1000 })
  wallet: number;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'text' })
  bio: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

}
