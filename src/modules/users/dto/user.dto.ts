import { ApiProperty } from '@nestjs/swagger';
import { User, UserRoles } from '@modules/users/orm';

type Props = 'createdAt' | 'updatedAt'
type TUserDTO = Omit<User, Props>

export class UserDTO implements TUserDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  role: UserRoles;

  @ApiProperty()
  password: string;

  @ApiProperty()
  salt: string;

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }
}
