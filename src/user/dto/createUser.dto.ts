import { IsNotEmpty } from 'class-validator';
import { UpdateUserDto } from './updateUser.dto';

export class CreateUserDto extends UpdateUserDto {
  @IsNotEmpty()
  userId: number;
}
