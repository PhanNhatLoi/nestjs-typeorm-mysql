import { BaseEntity } from 'src/base/entities/base-entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Province } from './province.entity';
import { Ward } from './ward.entity';

@Entity({ name: 'district' })
export class District extends BaseEntity {
  @Column({
    name: 'name',
  })
  name: string;

  @ManyToOne(() => Province, (province) => province.districts)
  @JoinColumn()
  province: Province;

  @OneToMany(() => Ward, (ward) => ward.district)
  @JoinColumn()
  wards: Ward[];
}
