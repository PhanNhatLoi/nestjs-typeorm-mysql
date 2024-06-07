import { BaseEntity } from 'src/base/entities/base-entity';
import { CATEGORY_TYPE } from 'src/shared/constants/global.constants';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'category' })
export class Category extends BaseEntity {
  // name of category
  @Column({
    unique: true,
    name: 'name',
  })
  name: string;

  //image public url
  @Column({
    name: 'imageUrl',
  })
  imageUrl: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: CATEGORY_TYPE,
  })
  type: CATEGORY_TYPE;

  @ManyToOne(() => Category, (category) => category.id, {
    nullable: true,
  })
  parent: Category;
}
