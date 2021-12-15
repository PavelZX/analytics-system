import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  mobileNumber: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}