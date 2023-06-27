import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Course } from 'src/course/entities/course.entity';
import { User } from 'src/user/entities/user.entity';


@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @ManyToOne(() => Course, course => course.courseId)
  course: Course;

  
}

