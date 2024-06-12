import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import {
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({
    name: 'Id',
  })
  id: number;

  @Column({ type: 'datetime', nullable: true, name: 'CreatedDate' })
  createdDate: Date;

  @ManyToOne(() => UserAccount, (user) => user.id)
  @JoinColumn()
  createdBy: UserAccount;

  @Column({ type: 'datetime', nullable: true, name: 'ModifiedDate' })
  modifiedDate: Date;

  @ManyToOne(() => UserAccount, (user) => user.id)
  @JoinColumn()
  modifiedBy: UserAccount;

  @Column({ default: false, name: 'IsDeleted' })
  isDeleted: boolean;
}
