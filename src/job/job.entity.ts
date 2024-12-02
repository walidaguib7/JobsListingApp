import { Employer } from 'src/employer/employer.entity';

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { JobType } from 'utils/enums';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  type: JobType;
  @Column()
  location: string;
  @Column()
  salary: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  posted_At: Date;
  @ManyToOne(() => Employer, (employer) => employer.jobs)
  employer: Employer;
}
