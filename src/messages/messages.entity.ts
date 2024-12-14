import { Conversation } from 'src/conversations/conversation.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sentAt: Date;

  @ManyToOne(() => User, (user) => user.messages_sent)
  sender: User;
  @ManyToOne(() => User, (user) => user.messages_received)
  receiver: User;
  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;
}
