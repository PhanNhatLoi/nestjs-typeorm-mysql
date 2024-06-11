import { UserAccount } from 'src/typeorm/entities/user-account.entity';
import { DeepPartial } from 'typeorm';

export class CreateCategoryDto {
  name: string;
  description: string;
  imageUrl: string;
  createdBy: DeepPartial<UserAccount>;
}
