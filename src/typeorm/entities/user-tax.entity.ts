import { BaseEntity } from 'src/base/entities/base-entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { UserAccount } from './user-account.entity';

@Entity({ name: 'user_tax' })
export class Tax extends BaseEntity {
  // user account id
  @OneToOne(() => UserAccount, (user) => user.tax)
  createdBy: UserAccount;

  @Column({
    default: '',
    name: 'BusinessType',
  })
  businessType: string;
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
    // unique: true,
    name: 'TaxCode',
  })
  taxCode: string;
  // Photo of business license url public
  @Column({
    nullable: true,
    type: 'json',
    name: 'PhotoLicense',
  })
  photoLicense: string[];
  // Photo of business license url public
  @Column({
    nullable: true,
    type: 'json',
    name: 'PhotoCatholicCertificate',
  })
  photoCatholic: string[];
}
