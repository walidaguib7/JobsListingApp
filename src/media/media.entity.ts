import { Application } from 'src/applications/application.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'Media',
})
export class Media {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  path: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @OneToOne(() => User, (user) => user.media)
  user: User;
  @OneToMany(() => Application, (application) => application.resume)
  applications: Application[];
}
