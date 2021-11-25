import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { RentService } from "./rent.service";
import { RentRequestDto } from "./dto/rent-request.dto";
import { DateValidationPipe } from "../pipes/date-validation.pipe";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { ReportResponseDto } from "./dto/report-response.dto";
import { CheckRentResponseDto } from "./dto/check-rent-response.dto";
import { RentResponseDto } from "./dto/rent-response.dto";

@ApiTags("rent")
@Controller("rent")
export class RentController {

  constructor(private readonly rentService: RentService) {
  }

  @Post("check")
  @ApiCreatedResponse({
    description: "Проверка аренды",
    type: CheckRentResponseDto
  })
  async checkRent(@Body() dto: RentRequestDto): Promise<CheckRentResponseDto> {
    return this.rentService.checkCarRent(dto);
  }

  @Post()
  @ApiCreatedResponse({
    description: "Арендовать машину",
    type: RentResponseDto
  })
  async rent(@Body() dto: RentRequestDto): Promise<RentResponseDto> {
    return this.rentService.rentCar(dto);
  }

  @Get(":date")
  @ApiCreatedResponse({
    description: "Отчет о средней загрузке машин в месяц",
    type: [ReportResponseDto]
  })
  async getReport(@Param("date", DateValidationPipe) date: string): Promise<ReportResponseDto[] | []> {
    return this.rentService.rentReport(date);
  }
}
