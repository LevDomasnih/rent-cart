import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
import dayjs from 'dayjs';

export class IsWeekday implements ValidatorConstraintInterface {
  validate(data: string, validationArguments?: ValidationArguments) {
    const date = dayjs(data, 'YYYY/MM/DD',true).date()

    return !(date === 6 || date === 0);
  }
}