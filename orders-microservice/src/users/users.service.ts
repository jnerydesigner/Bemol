import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from './repository/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private readonly usersRepository: UsersRepository,
  ) {}

  async saveUser(user: any) {
    return this.usersRepository.save(user);
  }
}
