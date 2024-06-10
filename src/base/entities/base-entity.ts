import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import {
  Column,
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
  createdBy: UserAccount;

  @Column({ type: 'datetime', nullable: true, name: 'ModifiedDate' })
  modifiedDate: Date;

  @ManyToOne(() => UserAccount, (user) => user.id)
  modifiedBy: UserAccount;

  @Column({ default: false, name: 'IsDeleted' })
  isDeleted: boolean;
}
