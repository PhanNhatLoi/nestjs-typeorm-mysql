import { USER_ROLE } from 'src/shared/constants/global.constants';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tax } from './user-tax.entity';
import { SubCategory } from './sub-category.entity';

@Entity({ name: 'user_account' })
export class UserAccount {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({
    name: 'Id',
  })
  id: number;

  @Column({ type: 'datetime', nullable: true, name: 'CreatedDate' })
  createdDate: Date;

  @Column({ type: 'datetime', nullable: true, name: 'ModifiedDate' })
  modifiedDate: Date;

  @Column({ default: false, name: 'IsDeleted' })
  isDeleted: boolean;

  // email is login name
  @Column({
    name: 'Email',
    unique: true,
  })
  email: string;

  // phone number
  @Column({
    name: 'Phone',
    default: '',
  })
  phone: string;

  // password login
  @Column({
    name: 'Password',
    default: '',
  })
  password: string;

  // address
  @Column({
    nullable: true,
    default: '',
    name: 'Address',
  })
  address: string;

  // job of user
  @Column({
    nullable: true,
    default: '',
    name: 'Job',
  })
  job: string;

  // role from USER_ROLE example user, supper_admin, ENTERPRISE,...
  @Column({
    type: 'enum',
    enum: USER_ROLE,
    default: USER_ROLE.USER,
  })
  role: USER_ROLE;

  // avatar user url public
  @Column({
    nullable: true,
    default: '',
    name: 'ProfileImage',
  })
  profileImage: string;

  // banner user url public
  @Column({
    nullable: true,
    default: '',
    name: 'BannerMedia',
  })
  bannerMedia: string;

  // referralId (use when user invite friend)
  // maybe change to relative many to one table user_account
  @Column({
    nullable: true,
    name: 'ReferralID',
  })
  referralID: number;

  // account is verify
  @Column({
    default: false,
    name: 'EmailVerified',
  })
  emailVerified: boolean;

  // company name
  @Column({
    default: '',
    nullable: true,
    name: 'CompanyName',
  })
  companyName: string;

  // website url
  @Column({
    default: '',
    nullable: true,
    name: 'WebsiteURL',
  })
  websiteURL: string;

  // nationality
  // maybe change to country code
  @Column({
    default: 'Viet Nam',
    nullable: true,
    name: 'Nationality',
  })
  nationality: string;

  // Favorite bible words
  @Column({
    default: '',
    nullable: true,
    name: 'FavoriteBibleWords',
  })
  favoriteBibleWords: string;

  // Introduction
  @Column({
    default: '',
    nullable: true,
    name: 'Introduction',
  })
  introduction: string;

  // social links
  @Column({
    type: 'json',
    name: 'SocialLinks',
    nullable: true,
  })
  socialLinks: {
    platform: string;
    accountName: string;
  }[];

  // Achievements
  @Column({
    type: 'json',
    name: 'Achievements',
    nullable: true,
  })
  achievements: {
    title: string;
    value: number;
  }[];

  // list tax information
  @OneToMany(() => Tax, (tax) => tax.id)
  tax: Tax[];

  // sub categories for filter
  @ManyToMany(() => SubCategory, (category) => category.id, { nullable: true })
  subCategories: SubCategory[];

  // average rating
  @Column('decimal', { precision: 2, scale: 1, default: 0 })
  averageRating: number;

  //location for feature search nearby
  @Column({
    nullable: true,
    name: 'location',
    type: 'json',
  })
  location: {
    lat: number;
    lng: number;
  };
}
