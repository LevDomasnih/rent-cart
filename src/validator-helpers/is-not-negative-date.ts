import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";
import * as moment from "moment";
import { CheckRentRequestDto } from "../rent/dto/check-rent-request-dto";


export function IsNotNegativeDate(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(data: string, { object }: ValidationArguments) {

          const {
            start_session,
            end_session
          } = object as CheckRentRequestDto

          const start = moment(start_session, "YYYY-MM-DD");
          const end = moment(end_session, "YYYY-MM-DD");

          const days = moment.duration(end.diff(start)).asDays();

          return days >= 0
        },

        defaultMessage(): string {
          return 'Конечная дата не может быть меньше стартовой!'
        }
      },
    });
  };
}