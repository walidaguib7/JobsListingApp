import { Job } from 'src/job/job.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @ManyToMany(() => Job, (job) => job.categories)
  jobs: Job[];
}
