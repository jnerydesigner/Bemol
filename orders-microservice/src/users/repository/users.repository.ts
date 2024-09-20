export interface UsersRepository {
  save(user: any): Promise<any>;
}
