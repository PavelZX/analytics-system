import {
  BadRequestException,
  Body,
  Controller,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { UpdateEmailDto } from '../dto/update-email.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { User } from '../schema/user.schema';
import { UserService } from '../service/user.service';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private userService: UserService) {}

  @Put('firstName')
  async updateUsername(
    @CurrentUser() user: User,
    @Body('firstName') firstName: string,
  ) {
    const usernameUser = await this.userService.getUserByName(firstName);

    if (usernameUser) {
      throw new BadRequestException('Имя пользователя уже занято');
    }

    user.firstName = firstName;

    return user.save();
  }

  @Put('mobileNumber')
  async updateMobileNumber(
    @CurrentUser() user: User,
    @Body('mobileNumber') mobileNumber: string,
  ) {
    const mobileNumberUser = await this.userService.getUserByMobileNumber(mobileNumber);

    if (mobileNumberUser) {
      throw new BadRequestException('Данный номер уже занят');
    }

    user.mobileNumber = mobileNumber;

    return user.save();
  }

  @Put('email')
  async updateEmail(@CurrentUser() user: User, @Body() body: UpdateEmailDto) {
    const emailUser = await this.userService.getUserByEmail(body.email);

    if (emailUser) {
      throw new BadRequestException('Email уже занят');
    }

    user.email = body.email;

    return user.save();
  }

  @Put('password')
  async updatePassword(
    @CurrentUser() user: User,
    @Body() body: UpdatePasswordDto,
  ) {
    if (
      !user.isSocial &&
      !(await user.validatePassword(body.currentPassword))
    ) {
      throw new BadRequestException('Текущий пароль не совпадает');
    }

    if (body.password !== body.confirmPassword) {
      throw new BadRequestException('Пароли не совпадают');
    }

    if (await user.validatePassword(body.password)) {
      throw new BadRequestException('Не используйте свой текущий пароль');
    }

    user.password = body.password;

    return user.save();
  }
}
