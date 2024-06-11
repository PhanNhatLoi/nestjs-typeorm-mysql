import { BaseEntity } from 'src/base/entities/base-entity';
import { Column, Entity, JoinTable, ManyToOne } from 'typeorm';
import { UserAccount } from './user-account.entity';
import { USER_ACTION_TYPE } from 'src/shared/constants/global.constants';

@Entity({ name: 'user_action' })
// action example: rating, comment, like, view,...
export class UserAction extends BaseEntity {
  @Column({
    nullable: true,
    default: '',
    name: 'content',
  })
  content: string;

  @Column({
    name: 'ActionType',
    type: 'enum',
    default: USER_ACTION_TYPE.VIEW,
    enum: USER_ACTION_TYPE,
  })
  actionType: USER_ACTION_TYPE;

  @Column({
    nullable: true,
    name: 'value',
    type: 'decimal',
    precision: 2,
    scale: 1,
    default: 0,
  })
  value: number;

  @ManyToOne(() => UserAccount, (user) => user.id)
  @JoinTable()
  user: UserAccount;
}
