import { randomUUID } from 'node:crypto';

export class UsersEntity {
  constructor(
    readonly userId: string,
    readonly name: string,
    readonly email: string,
    readonly password: string,
  ) {}

  static createUser(
    name: string,
    email: string,
    password: string,
  ): UsersEntity {
    const userId = randomUUID();
    return new UsersEntity(userId, name, email, password);
  }
}
