import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SendMailDto {
  @IsNotEmpty()
  @ApiProperty()
  sendTo: string;

  @IsNotEmpty()
  @ApiProperty()
  subject: string;

  @IsNotEmpty()
  @ApiProperty()
  content: string;
}
