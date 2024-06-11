import { BaseEntity } from 'src/base/entities/base-entity';
import { Column, Entity, JoinTable, ManyToOne } from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity({ name: 'user_contact' })
export class UserContact extends BaseEntity {
  @Column({
    default: '',
    name: 'note',
  })
  note: string;

  @Column({
    default: '',
    name: 'phone',
  })
  phone: string;

  @ManyToOne(() => UserAccount, (user) => user.id)
  @JoinTable()
  user: UserAccount;
}
