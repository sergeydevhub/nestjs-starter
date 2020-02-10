import { UserRoles } from '../orm';
import { UserDTO } from '../dto';
import { LoginUserDto } from '@modules/auth/dto';
import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';

type OmitProps = 'id' | 'updatedAt' | 'createdAt' | 'salt' | 'password'
type TCreateUserDTO = Omit<UserDTO, OmitProps | keyof LoginUserDto>

export class CreateUserDto extends LoginUserDto implements TCreateUserDTO {
  @MinLength(3)
  @MaxLength(20)
  @IsString()
  public name!: string;

  @MinLength(3)
  @MaxLength(20)
  @IsString()
  public surname!: string;

  @IsInt()
  public age: number;

  public role: UserRoles;
}