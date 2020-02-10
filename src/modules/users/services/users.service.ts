import { FindOneOptions } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { from, Observable, of, throwError } from 'rxjs';
import { UserEntity, UsersRepository } from '@modules/users/orm';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

@Injectable()
export class UsersService {
  constructor(
    protected readonly usersRepository: UsersRepository
  ) {}

  public create(createUserDTO: CreateUserDto): Observable<UserEntity> {
    const existsRecord$: Observable<number> = from(
      this.usersRepository.count({ email: createUserDTO.email })
    );

    return existsRecord$.pipe(
      map((count: number) => {
        if(count) {
          throw new BadRequestException('Passed email already used')
        }

        return this.usersRepository.create(createUserDTO);
      }),
      switchMap((user: UserEntity) => from(this.usersRepository.save(user))),
      switchMap((user: UserEntity) => this.usersRepository.findOneOrFail(user.id))
    )
  }

  public getById(
    id: UserEntity['id'],
    options?: FindOneOptions<UserEntity>
  ): Observable<UserEntity | null> {
    return from(
      this.usersRepository.findUserById(id, options)
    ).pipe(
      map( user => {
        if(!user) {
          return throwError(new NotFoundException(`Record not found`))
        }
        return user
      }),
      catchError((err, caught) => of(err))
    )
  }

  public getUserBy<T extends any>(
    options: FindOneOptions<UserEntity>
  ): Observable<UserEntity | null> {
    return from(
      this.usersRepository.findOneUser(options)
    ).pipe(
      map( user => {
        if(!user) {
          return throwError(new NotFoundException(`Record not found`))
        }

        return user;
      }),
      catchError((err, caught) => of(err))
    )
  }
}