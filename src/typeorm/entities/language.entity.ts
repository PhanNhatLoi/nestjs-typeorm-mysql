import { BaseEntity } from 'src/base/entities/base-entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'language' })
export class Language extends BaseEntity {
  @Column({
    unique: true,
    name: 'name',
  })
  name: string;

  @Column({
    unique: true,
    name: 'SortName',
  })
  sortName: string;
  @Column({
    name: 'DataSource',
    nullable: true,
    type: 'json',
  })
  dataSource: any;
}
