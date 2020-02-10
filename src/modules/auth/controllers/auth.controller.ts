import { Controller, Post, Get, UseGuards, Body, Res, Req, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from '../services';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { UserEntity } from '@modules/users/orm';
import { map } from 'rxjs/operators';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ApiOkResponse({ type: UserEntity })
  public login(
    @Body() user: UserEntity,
    @Res() res: Response
  ): Observable<Response> {
    return this.authService
      .login(user)
      .pipe(
        map(result => {
          res.cookie('ACCESS_TOKEN', result.access_token);

          return res.status(HttpStatus.OK).send(user)
        })
      )
  }

  @Post('logout')
  @UseGuards(AuthGuard())
  @ApiOkResponse()
  public logout(@Res() res): Response {
    return res.clearCookie('ACCESS_TOKEN')
      .status(HttpStatus.OK)
      .send()
  }
}
