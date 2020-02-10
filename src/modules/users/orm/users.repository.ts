import { Repository, EntityRepository, FindOneOptions, FindManyOptions } from 'typeorm';
import { UserEntity } from '../orm';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  public findOneUser(options: FindOneOptions<UserEntity> = {}): Observable<UserEntity> {
    return from(
      this.findOneOrFail(options)
    ).pipe(
      map((user: UserEntity) => user)
    )
  }

  public findUserById(
    id: UserEntity['id'],
    options: FindOneOptions<UserEntity>
  ): Observable<UserEntity> {
    return from(
      this.findOneOrFail(id, options)
    ).pipe(
      map((user: UserEntity) => user)
    )
  }

  public findUsersById(
    ids: Array<number>,
    options: FindManyOptions<UserEntity> = {}
  ): Observable<Array<UserEntity>> {
    return from(
      this.findByIds(ids, options)
    ).pipe(
      map((users: Array<UserEntity>) => users)
    )
  }
}