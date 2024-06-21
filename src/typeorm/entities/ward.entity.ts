import { BaseEntity } from 'src/base/entities/base-entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { District } from './district.entity';
import { UserAddress } from './user-address.entity';

@Entity({ name: 'ward' })
export class Ward extends BaseEntity {
  @Column({
    name: 'name',
  })
  name: string;

  @ManyToOne(() => District, (district) => district.wards)
  @JoinColumn()
  district: District;

  @OneToMany(() => UserAddress, (address) => address.ward)
  @JoinColumn()
  address: UserAddress[];
}
