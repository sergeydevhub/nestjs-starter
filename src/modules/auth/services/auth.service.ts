import { from, Observable, of } from 'rxjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CryptoService } from '@shared/crypto';
import { UserEntity } from '@modules/users/orm';
import { UsersService } from '@modules/users/services';
import { LoginUserDto } from '../dto';
import { map, switchAll, switchMap } from 'rxjs/operators';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    protected readonly cryptoService: CryptoService,
    protected readonly usersService: UsersService,
    protected readonly jwtService: JwtService
  ) {}

  validate({ email, password }: LoginUserDto): Observable<UserEntity | null> {
    const user$: Observable<UserEntity> = from(
      this.usersService.getUserBy({
        where: { email },
        select: ['id', 'password', 'salt']
      })
    );


    return user$.pipe(
      map((user: UserEntity) => {
        return from(
          this.cryptoService.hashPassword(password, user.salt)
        ).pipe(
          map((hash: string) => ({ hash, user }))
        )
      }),
      switchAll(),
      switchMap(data => {
        const { hash, user } = data;
        if(user.password === hash) {
          return from(this.usersService.getById(user.id));
        }

        return of(null)
      })
    )
  }

  login({ email, id }: UserEntity): Observable<{ access_token: string}> {
    const payload = { email, sub: id };
    const result = { access_token: this.jwtService.sign(payload) };

    return of(result);
  }
}