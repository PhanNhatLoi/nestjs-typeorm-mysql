import { BaseEntity } from 'src/base/entities/base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Business } from './business.entity';
import { UserAccount } from './user-account.entity';

@Entity({ name: 'tax' })
export class Tax extends BaseEntity {
  // user account id
  @ManyToOne(() => UserAccount, (user) => user.id)
  user: UserAccount;

  // business type id
  @ManyToOne(() => Business, (business) => business.id)
  businessType: Business;
  //address user register the tax
  @Column({
    name: 'RegisterAddress',
  })
  registerAddress: string;
  // address user register the tax
  @Column({
    nullable: true,
    name: 'RegisterEmail',
  })
  registerEmail: string;

  // tax code
  @Column({
    name: 'TaxCode',
  })
  taxCode: string;
  // Photo of business license url public
  @Column({
    nullable: true,
    name: 'PhotoLicense',
  })
  photoLicense: string;
  // Photo of business license url public
  @Column({
    nullable: true,
    name: 'PhotoCatholicCertificate',
  })
  photoCatholic: string;
}
