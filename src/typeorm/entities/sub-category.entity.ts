import { BaseEntity } from 'src/base/entities/base-entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { UserAccount } from './user-account.entity';

@Entity({ name: 'sub-category' })
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

  @ManyToOne(() => Category, (category) => category.id)
  parent: Category;

  // sub categories for filter
  @ManyToMany(() => UserAccount, (user) => user.id, { nullable: true })
  user: UserAccount[];
}
