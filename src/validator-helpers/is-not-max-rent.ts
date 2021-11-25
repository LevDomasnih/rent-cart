import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";
import * as moment from "moment";
import { RentRequestDto } from "../rent/dto/rent-request.dto";


export function IsNotMaxRent(validationOptions?: ValidationOptions) {
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
          } = object as RentRequestDto

          const start = moment(start_session, "YYYY-MM-DD");
          const end = moment(end_session, "YYYY-MM-DD");

          const days = moment.duration(end.diff(start)).asDays();

          return days < 30
        },

        defaultMessage(): string {
          return 'Максимальная аренда автомобиля - 30 дней'
        }
      },
    });
  };
}