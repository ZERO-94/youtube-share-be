import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserSeederService {
  constructor(private readonly userService: UsersService) {}

  @Command({
    command: 'create:user',
    describe: 'create a user',
  })
  async create() {
    const user = await this.userService.create({
      email: 'test@test.com',
      password: '123456',
    });
    console.log(user);
  }
}
