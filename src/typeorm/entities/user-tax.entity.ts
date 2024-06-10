import { BaseEntity } from 'src/base/entities/base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserAccount } from './user-account.entity';
import { Category } from './category.entity';

@Entity({ name: 'user-tax' })
export class Tax extends BaseEntity {
  // user account id
  @ManyToOne(() => UserAccount, (user) => user.id)
  user: UserAccount;

  // business type id
  @ManyToOne(() => Category, (category) => category.id)
  businessType: Category;
  //address user register the tax
  @Column({
    default: '',
    name: 'Address',
  })
  address: string;
  // address user register the tax
  @Column({
    nullable: true,
    default: '',
    name: 'Email',
  })
  email: string;

  // tax code
  @Column({
    default: '',
    name: 'TaxCode',
  })
  taxCode: string;
  // Photo of business license url public
  @Column({
    nullable: true,
    default: '',
    name: 'PhotoLicense',
  })
  photoLicense: string;
  // Photo of business license url public
  @Column({
    nullable: true,
    default: '',
    name: 'PhotoCatholicCertificate',
  })
  photoCatholic: string;
}
