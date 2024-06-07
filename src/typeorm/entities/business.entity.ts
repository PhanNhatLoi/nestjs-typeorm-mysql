import { BaseEntity } from 'src/base/entities/base-entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'business' })
export class Business extends BaseEntity {
  @Column({
    unique: true,
    name: 'name',
  })
  name: string;

  @Column({
    nullable: true,
    name: 'description',
  })
  description: string;
}
