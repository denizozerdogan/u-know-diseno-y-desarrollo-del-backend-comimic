import { ApiTags } from "@nestjs/swagger";
import { Course } from "src/course/entities/course.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@ApiTags('purchase')
@Entity()
export class Purchase {

    @PrimaryGeneratedColumn()
    purchaseId: number;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    buyer: User;

    @ManyToOne(() => Course, course => course.courseId)
    @JoinColumn({ name: 'courseId', referencedColumnName: 'courseId' })
    course: Course;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

}
