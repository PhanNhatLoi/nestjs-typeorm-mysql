import { Module } from '@nestjs/common';
import { SubCategoryService } from './services/sub-category.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}
