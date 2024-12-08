import { Application } from 'src/applications/application.entity';
import { Category } from 'src/categories/category.entity';
import { Employer } from 'src/employer/employer.entity';
import { Saved_Jobs } from 'src/saved_jobs/saved_jobs.entity';

import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
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
  @ManyToMany(() => Category, (category) => category.jobs)
  @JoinTable({ name: 'Job_Categories' })
  categories: Category[];
  @OneToMany(() => Saved_Jobs, (saved_jobs) => saved_jobs.user)
  saved_jobs: Saved_Jobs[];
  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];
}
