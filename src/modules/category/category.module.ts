import { Module } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryController } from './category.controller';
import { CategoryRepository } from 'src/typeorm/repositories/category.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/typeorm/entities/category.entity';
import { ICategoryService } from './services/category.service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Category], 'identity')],
  controllers: [CategoryController],
  providers: [
    {
      provide: 'ICategoryRepository',
      useClass: CategoryRepository,
    },
    {
      provide: ICategoryService,
      useClass: CategoryService,
    },
  ],
})
export class CategoryModule {}
