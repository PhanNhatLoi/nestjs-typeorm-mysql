import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity({ name: 'otp' })
export class OtpCode {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({
    name: 'Id',
  })
  id: number;

  @Column({
    type: 'datetime',
    name: 'CreatedDate',
  })
  createdDate: Date;

  @Column({
    nullable: true,
    type: 'datetime',
    name: 'ExpDate',
  })
  expDate: Date;

  @Column({
    default: '',
    name: 'code',
  })
  code: string;

  @ManyToOne(() => UserAccount, (user) => user.id)
  user: UserAccount;
}
