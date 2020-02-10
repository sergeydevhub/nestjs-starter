import { Strategy, ExtractJwt, JwtFromRequestFunction } from 'passport-jwt'
import { Injectable } from '@nestjs/common';
import { AbstractStrategy, PassportStrategy } from '@nestjs/passport';
import { UserEntity } from '@modules/users/orm';
import { UsersService } from '@modules/users/services';
import { Request } from 'express';

const requestHandler: JwtFromRequestFunction = (req: Request) => req.cookies ? req.cookies['access_token'] : null;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) implements AbstractStrategy {
  constructor(
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        requestHandler
      ]),
      retryAttempts: 5,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    })
  }

  public async validate(
    payload: any
  ): Promise<UserEntity> {
    return await this.usersService
      .getById(payload.sub)
      .toPromise();
  }
}