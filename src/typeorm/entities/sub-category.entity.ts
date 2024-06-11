import { BaseEntity } from 'src/base/entities/base-entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { UserAccount } from './user-account.entity';

@Entity({ name: 'sub_category' })
export class SubCategory extends BaseEntity {
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

  @ManyToOne(() => Category, (category) => category.children)
  @JoinColumn()
  parent: Category;

  // sub categories for filter
  @ManyToMany(() => UserAccount, (user) => user.subCategories, {
    nullable: true,
  })
  users: UserAccount[];
}
