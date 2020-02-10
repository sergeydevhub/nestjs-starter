import { UserDTO } from '@modules/users/dto';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

type RequiredProps = 'email' | 'password'
type Props = Pick<UserDTO, RequiredProps>

export class LoginUserDto implements Props {
  @IsEmail()
  @IsNotEmpty()
  public email!: string;

  @IsString()
  @MinLength(12)
  public password!: string;
}