import { BaseEntity } from 'src/base/entities/base-entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { UserAccount } from './user-account.entity';
import { SubCategory } from './sub-category.entity';

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
  // sub categories for filter
  @ManyToMany(() => UserAccount, (user) => user.categories, {
    nullable: true,
  })
  users: UserAccount[];

  @OneToMany(() => SubCategory, (subCategory) => subCategory.parent)
  children: SubCategory;
}
