import { Application } from 'src/applications/application.entity';
import { Conversation } from 'src/conversations/conversation.entity';
import { Employer } from 'src/employer/employer.entity';
import { Media } from 'src/media/media.entity';
import { Messages } from 'src/messages/messages.entity';
import { Notification } from 'src/notifications/notification.entity';
import { Review } from 'src/reviews/review.entity';
import { Saved_Jobs } from 'src/saved_jobs/saved_jobs.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
  @OneToOne(() => Media, (media) => media.user)
  @JoinColumn()
  media: Media;
  @OneToOne(() => Employer)
  employer: Employer;
  @OneToMany(() => Saved_Jobs, (saved_jobs) => saved_jobs.user)
  saved_jobs: Saved_Jobs[];
  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];
  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
  @ManyToMany(() => Employer, (employer) => employer.followers)
  followed_companies: Employer[];
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
  @OneToMany(() => Conversation, (conversation) => conversation.user)
  conversations: Conversation[];
  @OneToMany(() => Messages, (message) => message.sender)
  messages_sent: Messages[];
  @OneToMany(() => Messages, (message) => message.receiver)
  messages_received: Messages[];
}
