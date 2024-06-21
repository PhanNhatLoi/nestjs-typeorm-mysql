import { BaseEntity } from 'src/base/entities/base-entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Ward } from './ward.entity';
import { UserAccount } from './user-account.entity';

@Entity({ name: 'user_address' })
export class UserAddress extends BaseEntity {
  @OneToOne(() => UserAccount, (user) => user.userAddress)
  @JoinColumn()
  createdBy: UserAccount;
  @Column({
    name: 'address',
  })
  address: string;

  @ManyToOne(() => Ward, (ward) => ward.id)
  @JoinColumn()
  ward: Ward;
}
