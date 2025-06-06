import { IsEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  name: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsString()
  imageUrl: string;
  @IsNumber()
  category: number;

  @IsEmpty()
  isDeleted?;
  @IsEmpty()
  id?;
}
