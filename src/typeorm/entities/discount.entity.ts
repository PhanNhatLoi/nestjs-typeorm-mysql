import { BaseEntity } from 'src/base/entities/base-entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'discount' })
export class Discount extends BaseEntity {
  //title
  @Column({
    default: '',
    name: 'title',
  })
  name: string;

  // short description
  @Column({
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

  /// todo add some field after
}
