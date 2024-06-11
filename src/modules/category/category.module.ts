import { Module } from '@nestjs/common';
import { CategoryService } from './services/category.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CategoryService],
})
export class CategoryModule {}
