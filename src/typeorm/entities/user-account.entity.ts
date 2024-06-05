import { Utils } from 'src/shared/utils/utils';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_account' })
export class UserAccount {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({
    name: 'Id',
  })
  id: number;

  @Column({
    type: 'datetime',
    nullable: true,
    name: 'CreatedDate',
  })
  createdDate: Date;

  @Column({
    default: false,
    name: 'IsDeleted',
  })
  isDeleted: boolean;

  @Column({
    name: 'Password',
  })
  password: string;

  @Column({
    name: 'Email',
    unique: true,
  })
  email: string;

  @Column({
    nullable: true,
    name: 'Address',
  })
  address: string;

  @Column({
    nullable: true,
    name: 'Job',
  })
  job: string;

  @Column({
    default: true,
    name: 'IsSuperAdmin',
  })
  isSuperAdmin: boolean;

  @Column({
    nullable: true,
    name: 'RoleId',
  })
  roleId: string;

  private _roles: number[];

  set roles(value: number[]) {
    this._roles = value;
    this.roleId = value == null ? '' : JSON.stringify(value);
  }

  get roles(): number[] {
    if (this._roles == null) {
      this._roles = Utils.String.parseJSON(this.roleId || '[]');
    }
    return this._roles;
  }

  @Column({
    nullable: true,
    name: 'ImageUrl',
  })
  imageUrl: string;

  @Column({
    name: 'PhoneNumber',
  })
  phoneNumber: string;

  @Column({
    nullable: true,
    name: 'RefferalId',
  })
  refferalId: number;

  @Column({
    default: false,
    name: 'EmailVerified',
  })
  emailVerified: boolean;

  @Column({
    nullable: true,
    name: 'RefreshToken',
  })
  refreshToken: string;
}
