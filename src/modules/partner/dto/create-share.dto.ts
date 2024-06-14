import { IsNumber } from 'class-validator';

export class CreateShareDto {
  @IsNumber()
  fromUserId: number;
  @IsNumber()
  toUserId: number;
}
