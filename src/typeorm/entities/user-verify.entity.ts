import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity({ name: 'user-verify' })
export class UserVerify {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({
    name: 'Id',
  })
  id: number;

  @Column({ default: false, name: 'IsDeleted' })
  isDeleted: boolean;

  @Column({
    type: 'datetime',
    name: 'CreatedDate',
    default: () => 'NOW()',
  })
  createdDate: Date;

  @Column({
    nullable: true,
    type: 'datetime',
    name: 'ExpiresDate',
  })
  expiresDate: Date;

  @Column({
    type: 'varchar',
    length: 6,
    default: '',
    name: 'otp',
  })
  otp: string;

  @ManyToOne(() => UserAccount, (user) => user.id)
  user: UserAccount;
}
