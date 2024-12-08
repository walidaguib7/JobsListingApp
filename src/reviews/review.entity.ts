import { Employer } from 'src/employer/employer.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  rating: number;
  @Column()
  content: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @ManyToOne(() => Employer, (employer) => employer.reviews)
  employer: Employer;
  @ManyToOne(() => User, (user) => user.reviews)
  user: User;
}
