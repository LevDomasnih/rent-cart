import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ReportModel } from '../../models/report.model';
import { Type } from 'class-transformer';

export class ReportResponseDto {

  constructor(cars_report: ReportModel[] | [], avg_cars_percent: number) {
    this.cars_report = cars_report;
    this.avg_cars_percent = avg_cars_percent;
  }

  @ApiProperty({ type: () => [ReportModel]})
  @IsString()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ReportModel)
  cars_report: ReportModel[] | []

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  avg_cars_percent: number
}