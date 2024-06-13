import { IsOptional, IsString, IsEmpty, IsNumber } from 'class-validator';

export class UpdateSubCategoryDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsString()
  @IsOptional()
  imageUrl: string;
  @IsNumber()
  @IsOptional()
  category: number;

  @IsEmpty()
  isDeleted;
  @IsEmpty()
  id;
}
