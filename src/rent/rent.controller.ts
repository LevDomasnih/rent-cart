import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RentService } from './rent.service';
import { CheckRentRequestDto } from './dto/check-rent-request-dto';

@Controller('rent')
export class RentController {

  constructor(private readonly rentService: RentService) { }

  @Post('check')
  async checkRent(@Body() dto: CheckRentRequestDto) {
    return this.rentService.checkCarRent(dto)
  }

  @Post('rent')
  async rent(@Body() dto: CheckRentRequestDto) {
    return this.rentService.rentCar(dto)
  }

  @Get(':date')
  async getReport(@Param('date') date: string) {
    return this.rentService.rentReport(date)
  }
}
