import { Strategy } from 'passport-local';
import { PassportStrategy, AbstractStrategy} from '@nestjs/passport';
import { AuthService } from '@modules/auth/services/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '@modules/users/orm';
import { LoginUserDto } from '@modules/auth/dto';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) implements AbstractStrategy {
  constructor(
    private readonly authService: AuthService
  ) {
    super({
      usernameField: 'email'
    })
  }

  public async validate(
    payload: LoginUserDto
  ): Promise<UserEntity | null> {
    return await this.authService
      .validate(payload)
      .pipe(
        catchError(() => of(null)),
        map((user: UserEntity | null) => {
          if(!user) throw new UnauthorizedException();

          return user;
        })
      )
      .toPromise()
  }
}