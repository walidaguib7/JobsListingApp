import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from 'utils/enums';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;
  @Column()
  firstname: string;
  @Column()
  lastname: string;
  @Column()
  username: string;
  @Column()
  email: string;
  @Column({ nullable: true })
  phone_number: string;
  @Column()
  passwordHash: string;
  @Column({ default: false })
  isVerified: boolean;
  @Column('text', { array: true })
  roles: string[];
}
