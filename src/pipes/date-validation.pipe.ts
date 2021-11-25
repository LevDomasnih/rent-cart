import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as moment from "moment";

@Injectable()
export class DateValidationPipe implements PipeTransform {
  transform(date: string, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') {
      return date
    }

    if (!moment(date, "YYYY-MM", true).isValid()) {
      throw new BadRequestException('Невалидная дата')
    }

    return date
  }

}