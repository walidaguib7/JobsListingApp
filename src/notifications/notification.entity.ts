import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  message: string;
  @Column({ default: false })
  isRead: boolean;
  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}
