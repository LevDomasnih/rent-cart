import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsWeekday } from '../../validator-helpers/is-weekday';

export class CheckRentRequestDto {

  @ApiProperty()
  @IsInt()
  id: number

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  @Validate(IsWeekday, {
    message: 'Аренда должна начинаться в будние дни',
  })
  start_session: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  @Validate(IsWeekday, {
    message: 'Аренда должна заканчиваться в будние дни',
  })
  end_session: string
}