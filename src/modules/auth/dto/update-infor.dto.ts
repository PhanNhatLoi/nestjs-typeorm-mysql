import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class TaxInformationDto {
  @IsOptional()
  @IsString()
  businessType: string;
  @IsOptional()
  @IsString()
  address: string;
  @IsOptional()
  @IsString()
  email: string;
  @IsOptional()
  @IsString()
  taxCode: string;
  @IsOptional()
  // @ValidateNested({ each: true })
  @IsArray()
  @Type(() => String)
  photoLicense: string[];
  @IsOptional()
  // @ValidateNested({ each: true })
  @IsArray()
  @Type(() => String)
  photoCatholic: string[];
}
export class UpdateInformationDto {
  //values invalid
  @IsEmpty()
  averageRating;
  @IsEmpty()
  emailVerified;

  @IsEmpty()
  createdDate;

  @IsEmpty()
  referralID;

  @IsEmpty()
  isDeleted;

  @IsEmpty()
  id;

  @IsEmpty()
  role;

  @IsEmpty()
  password;

  @IsEmpty()
  email;

  //values invalid

  @IsOptional()
  @IsPhoneNumber('VI')
  phone: string;
  @IsString()
  @IsOptional()
  address: string;
  @IsString()
  @IsOptional()
  job: string;
  @IsString()
  @IsOptional()
  profileImage: string;
  @IsString()
  @IsOptional()
  bannerMedia: string;
  @IsString()
  @IsOptional()
  companyName: string;
  @IsString()
  @IsOptional()
  websiteURL: string;
  @IsString()
  @IsOptional()
  nationality: string;
  @IsString()
  @IsOptional()
  favoriteBibleWords: string;
  @IsString()
  @IsOptional()
  introduction: string;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks: {
    platform: string;
    accountName: string;
  }[];
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AchievementsDto)
  achievements: {
    title: string;
    value: number;
  }[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TaxInformationDto)
  tax: TaxInformationDto;
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LocationDto)
  location: {
    lat: number;
    lng: number;
  };
  @IsOptional()
  @IsArray()
  subCategories: number[];
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  categories: number[];
  // ...field
}

export class SocialLinkDto {
  @IsString()
  platform: string;
  @IsString()
  accountName: string;
}

export class AchievementsDto {
  @IsString()
  title: string;
  @IsNumber()
  value: number;
}

export class LocationDto {
  @IsNumber()
  lat: number;
  @IsNumber()
  lng: number;
}
