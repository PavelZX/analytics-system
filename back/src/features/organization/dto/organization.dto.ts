import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class OrganizationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
