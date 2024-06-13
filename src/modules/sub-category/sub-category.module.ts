import { Module } from '@nestjs/common';
import { SubCategoryService } from './services/sub-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from 'src/typeorm/entities/sub-category.entity';
import { SubCategoryRepository } from 'src/typeorm/repositories/sub-category.repository';
import { ISubCategoryService } from './services/sub-category.service.interface';
import { SubCategoryController } from './sub-category.controller';
import { ICategoryService } from '@modules/category/services/category.service.interface';
import { CategoryService } from '@modules/category/services/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategory], 'identity')],
  controllers: [SubCategoryController],
  providers: [
    {
      provide: 'ISubCategoryRepository',
      useClass: SubCategoryRepository,
    },
    {
      provide: ISubCategoryService,
      useClass: SubCategoryService,
    },
    {
      provide: ICategoryService,
      useClass: CategoryService,
    },
  ],
})
export class SubCategoryModule {}
