import { IsOptional, IsString, IsEmpty } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsString()
  @IsOptional()
  imageUrl: string;
  @IsEmpty()
  isDeleted;
  @IsEmpty()
  id;
}
