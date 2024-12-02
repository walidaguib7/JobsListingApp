import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
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
}
