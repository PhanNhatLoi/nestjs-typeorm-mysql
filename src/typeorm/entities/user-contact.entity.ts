import { BaseEntity } from 'src/base/entities/base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserAccount } from './user-account.entity';
import { CONTACT_STATUS } from 'src/shared/constants/global.constants';

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

  @Column({
    nullable: true,
    default: CONTACT_STATUS.WAITING,
    name: 'Status',
  })
  status: string;

  @ManyToOne(() => UserAccount, (user) => user.id)
  @JoinColumn()
  user: UserAccount;
}
