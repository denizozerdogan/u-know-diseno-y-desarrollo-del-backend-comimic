import { ApiTags } from "@nestjs/swagger";
import { IsInt, Min, Max } from "class-validator";
import { User } from "../../user/entities/user.entity";
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

    @Column({default: 200})
    price: number;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ default: false})
    approved: boolean;

    @Column({
      type: 'enum',
      enum: courseDifficulty,
      default: courseDifficulty.Easy,
    })
    difficulty: courseDifficulty;

    @Column()
    topic: string;

    @Column({ type: 'decimal', precision: 2, scale: 1, default: 5 })
    rating: number;

    @Column({ type: 'json', nullable: true })
    stars: Array<{ value: number }>;

    @Column({ type: 'text', nullable: true })
    content: string;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
    creator: User;
  

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
