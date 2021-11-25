import { IsBoolean, IsNotEmpty, IsNumber, ValidateIf } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CheckRentResponseDto {

  constructor(price: number | null, isRented: boolean) {
    this.price = price;
    this.isRented = isRented;
  }

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  price: number | null

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isRented: boolean
}