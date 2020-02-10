import {
  Controller,
  UseGuards,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../services';
import { CreateUserDto, UserDTO } from '../dto';
import { AuthGuard } from '@nestjs/passport';
import { User, UserEntity } from '@modules/users/orm';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  public createUser(
    @Body() userDTO: CreateUserDto,
    @Res() res: Response
  ): Observable<Response> {
    return this.usersService
      .create(userDTO)
      .pipe(
        map<UserEntity, Response>(
        (user: UserEntity) => res.status(HttpStatus.CREATED).send(user)
        )
    )
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: UserEntity })
  public findOne(
    @Param('id') param: UserDTO['id'],
    @Res() res: Response
  ): Observable<Response> {
    const record$ = this.usersService.getById(param);

    return record$.pipe(
      map((user: UserEntity | null) => {
        if(user) {
          return res.status(HttpStatus.FOUND).send(record$)
        }

        return res.status(HttpStatus.NOT_FOUND);
      })
    )
  }
}