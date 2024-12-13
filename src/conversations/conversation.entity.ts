import { Employer } from 'src/employer/employer.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  title: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @ManyToOne(() => User, (user) => user.conversations, { onDelete: 'CASCADE' })
  user: User;
  @ManyToOne(() => Employer, (employer) => employer.conversations, {
    onDelete: 'CASCADE',
  })
  employer: Employer;
}
