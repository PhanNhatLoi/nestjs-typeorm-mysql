import { Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({
    name: 'Id',
  })
  id: number;

  @Column({ type: 'datetime', nullable: true, name: 'CreatedDate' })
  createdDate: Date;

  @Column()
  createdBy: number;

  @Column({ type: 'datetime', nullable: true, name: 'ModifiedDate' })
  modifiedDate: Date;

  @Column({ name: 'ModifiedBy' })
  modifiedBy: number;

  @Column({ default: false, name: 'IsDeleted' })
  isDeleted: boolean;
}
