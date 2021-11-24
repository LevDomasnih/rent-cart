import { Body, Controller, Post } from '@nestjs/common';
import { RentService } from './rent.service';
import { CheckRentRequestDto } from './dto/check-rent-request-dto';

@Controller('rent')
export class RentController {

  constructor(private readonly rentService: RentService) { }

  @Post('check')
  async checkRent(@Body() dto: CheckRentRequestDto) {
    // return this.rentService.carIsNotRented(dto)
  }
}
