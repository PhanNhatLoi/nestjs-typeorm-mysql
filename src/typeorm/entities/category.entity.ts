import { BaseEntity } from 'src/base/entities/base-entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'category' })
export class Category extends BaseEntity {
  // name of category
  @Column({
    unique: true,
    name: 'name',
  })
  name: string;

  @Column({
    nullable: true,
    default: '',
    name: 'description',
  })
  description: string;

  //image public url
  @Column({
    default: '',
    name: 'imageUrl',
  })
  imageUrl: string;
}
