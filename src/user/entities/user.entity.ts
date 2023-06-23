import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany, JoinColumn } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { Course } from 'src/course/entities/course.entity';

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}


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

  @Column({ default: ''})
  bio?: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({
      type: 'enum',
      enum: UserRole,
      default: UserRole.User,
    })
  role: UserRole;

  @ManyToMany(() => Course, course => course.creator)
  @JoinColumn({referencedColumnName: 'courseId' })
  created_courses: Course[];

  @ManyToMany(() => Course, course => course.buyers)
  @JoinColumn({referencedColumnName: 'courseId' })
  bought_courses: Course[];

  }
