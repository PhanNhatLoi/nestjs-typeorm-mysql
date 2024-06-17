import { BaseEntity } from 'src/base/entities/base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity({ name: 'discount' })
export class Discount extends BaseEntity {
  //title
  @Column({
    default: '',
    name: 'title',
  })
  title: string;

  // short description
  @Column({
    default: '',
    name: 'description',
  })
  description: string;

  //image public url
  @Column({
    default: '',
    name: 'imageUrl',
  })
  imageUrl: string;

  @Column({
    nullable: true,
    type: 'datetime',
    name: 'ExpiresTime',
  })
  expiresTime: Date;

  @Column({
    nullable: true,
    type: 'datetime',
    name: 'StartDate',
    default: () => 'NOW()',
  })
  startDate: Date;

  @ManyToOne(() => UserAccount, (user) => user.discounts)
  @JoinColumn()
  user: UserAccount;
  /// todo add some field after
}
