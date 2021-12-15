import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '../../../shared/pipe/parse-object-id.pipe';
import { UserDto } from '../dto/user.dto';
import { UserService } from '../service/user.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':firstName')
  async getUser(@Param('firstName') firstName: string) {
    return this.userService.filterUser(
      await this.userService.validateUserByName(firstName),
    );
  }


  @Get('id/:id')
  get(@Param('id', ParseObjectIdPipe) id: string) {
    return this.userService.getUser(id);
  }

  @Get('all')
  getUsers() {
    return this.userService.getUsers();
  }

  @Delete('delete/:id')
  async delete(
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.userService.deleteUser(
      await this.userService.validateUserById(id)
    );
  }

  @Post()
  async create(@Body() user: UserDto) {
    return this.userService.create(user);
  }

  @Put(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() body: UserDto,
  ) {
    return this.userService.updateUser(
      await this.userService.validateUserById(id),
      body,
    );
  }
}  