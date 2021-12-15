import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ChannelDto {
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
