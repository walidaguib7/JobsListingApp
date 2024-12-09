import { Job } from 'src/job/job.entity';
import { Review } from 'src/reviews/review.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Employer {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  CompanyName: string;
  @Column()
  website: string;
  @Column()
  Company_Description: string;
  @Column()
  Country: string;
  @Column()
  city: string;
  @Column()
  zipCode: number;
  @OneToOne(() => User, (user) => user.employer)
  @JoinColumn()
  user: User;
  @OneToMany(() => Job, (job) => job.employer, { onDelete: 'CASCADE' })
  jobs: Job[];
  @OneToMany(() => Review, (review) => review.employer)
  reviews: Review[];
  @ManyToMany(() => User, (user) => user.followed_companies)
  @JoinTable({
    name: 'following',
    joinColumn: {
      name: 'companyId', // The column in the join table for this entity
      referencedColumnName: 'id', // The primary key of this entity
    },
    inverseJoinColumn: {
      name: 'userId', // The column in the join table for the related entity
      referencedColumnName: 'userId', // The primary key of the related entity
    },
  })
  followers: User[];
}
