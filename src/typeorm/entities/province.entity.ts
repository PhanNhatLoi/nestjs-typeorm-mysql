import { BaseEntity } from 'src/base/entities/base-entity';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { District } from './district.entity';

@Entity({ name: 'province' })
export class Province extends BaseEntity {
  @Column({
    name: 'name',
  })
  name: string;

  @OneToMany(() => District, (district) => district.province)
  @JoinColumn()
  districts: District[];
}
