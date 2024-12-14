import { Employer } from 'src/employer/employer.entity';
import { Messages } from 'src/messages/messages.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
  @ManyToOne(() => User, (user) => user.conversations, {
    onDelete: 'CASCADE',
  })
  employer: User;
  @OneToMany(() => Messages, (messages) => messages.conversation)
  messages: Messages[];
}
