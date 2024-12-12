import { Job } from 'src/job/job.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'saved_jobs' })
export class Saved_Jobs {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  savedAt: Date;
  @ManyToOne(() => User, (user) => user.saved_jobs, { onDelete: 'CASCADE' })
  user: User;
  @ManyToOne(() => Job, (job) => job.saved_jobs, { onDelete: 'CASCADE' })
  job: Job;
}
