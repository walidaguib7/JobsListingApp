import { Job } from 'src/job/job.entity';
import { Media } from 'src/media/media.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApplicationStatus } from 'utils/enums';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  coverletter: string;
  @Column()
  status: ApplicationStatus;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  savedAt: Date;
  @ManyToOne(() => Media, (media) => media.applications)
  resume: Media;
  @ManyToOne(() => User, (user) => user.applications)
  user: User;
  @ManyToOne(() => Job)
  job: Job;
}
