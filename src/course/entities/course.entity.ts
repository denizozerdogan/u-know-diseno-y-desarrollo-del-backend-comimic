import { ApiTags } from "@nestjs/swagger";
import { IsInt, Min, Max } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { ManyToMany, JoinTable, Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, JoinColumn, ManyToOne } from "typeorm";

export enum courseDifficulty {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard',
}

@ApiTags('course')
@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    courseId: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    @Column()
    approved: boolean;

    @Column({
      type: 'enum',
      enum: courseDifficulty,
      default: courseDifficulty.Easy,
    })
    difficulty: courseDifficulty;

    @Column({ nullable: true })
    topic: string;

    @Column({ type: 'decimal', precision: 2, scale: 1, default: 5 })
    rating: number;

  //   @Column({ type: 'simple-array', default: [], array: true, nullable: true })
  //   @IsInt({ each: true })
  //   @Min(1, { each: true })
  //   @Max(5, { each: true })
  //   star: number[];

    @ManyToOne(() => User, user => user.created_courses)
    @JoinTable({ name: 'creatorId' })
    creator: User;
  
    @ManyToMany(() => User, user => user.bought_courses)
    @JoinTable()
    buyers: User[];

  //   @BeforeUpdate()
  //   @BeforeInsert()
  //   calculateRating() {
  //   if (this.star && this.star.length > 0) {
  //     if (this.star.length >= 5) {
  //       const sum = this.star.reduce((total, current) => total + current, 0);
  //       const ratingFromFifthStar = (sum - 4.8 * 4) / (this.star.length - 4);
  //       this.rating = parseFloat(ratingFromFifthStar.toFixed(1));
  //     } 
  //   } 
  // }
}
