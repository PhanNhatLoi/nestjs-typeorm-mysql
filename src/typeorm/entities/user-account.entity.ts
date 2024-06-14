import { USER_ROLE } from 'src/shared/constants/global.constants';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tax } from './user-tax.entity';
import { SubCategory } from './sub-category.entity';
import { Category } from './category.entity';

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
    default: USER_ROLE.ENTERPRISE,
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
    type: 'json',
    name: 'BannerMedia',
  })
  bannerMedia: string[];

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

  // company name or name with user
  @Column({
    default: '',
    nullable: true,
    name: 'Name',
  })
  name: string;

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
    type: 'json',
    name: 'FavoriteBibleWords',
  })
  favoriteBibleWords: any;

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
  @OneToOne(() => Tax, (tax) => tax.createdBy)
  // @JoinColumn()
  tax: Tax;

  // sub categories for filter
  @ManyToMany(() => SubCategory, (subCategory) => subCategory.users, {
    nullable: true,
  })
  @JoinTable()
  subCategories: SubCategory[];

  // categories
  @ManyToMany(() => Category, (category) => category.users, {
    nullable: true,
  })
  @JoinTable()
  categories: Category[];

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

  @Column({
    name: 'IsLoggedIn',
    nullable: true,
    default: false,
  })
  isLoggedIn: boolean;
}
