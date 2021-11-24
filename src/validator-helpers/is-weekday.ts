import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import * as moment from "moment";


@ValidatorConstraint()
export class IsWeekday implements ValidatorConstraintInterface {
  validate(data: string, validationArguments?: ValidationArguments) {
    const date = moment(data).day()

    return !(date === 6 || date === 0);
  }
}