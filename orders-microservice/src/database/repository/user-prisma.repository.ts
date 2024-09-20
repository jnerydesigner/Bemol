import { PrismaService } from '@app/database/client/prisma.service';
import { UsersEntity } from '@app/users/entities/users.entity';
import { UsersRepository } from '@app/users/repository/users.repository';

export class UsersPrismaRepository implements UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async save(user: any): Promise<any> {
    const userCreted = UsersEntity.createUser(
      user.name,
      user.email,
      user.password,
    );
    return this.prismaService.users.create({
      data: {
        userId: userCreted.userId,
        name: userCreted.name,
        email: userCreted.email,
        password: userCreted.password,
      },
    });
  }
}
