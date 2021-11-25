import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ReportResponseDto {

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
  rent_percent: number
}