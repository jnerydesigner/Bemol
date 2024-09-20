import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async saveUser(@Body() user: any) {
    return this.usersService.saveUser(user);
  }
}
