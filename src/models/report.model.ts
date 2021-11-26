import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReportModel {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  car_number: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  car_name: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  car_percent: number;
}