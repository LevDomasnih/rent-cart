import { Injectable } from "@nestjs/common";
import { DbService } from "../db/db.service";
import { RentRequestDto } from "./dto/rent-request.dto";
import * as moment from "moment";
import { RentModel } from "../models/rent.model";
import { TariffsModel } from "../models/tariffs.model";
import { ReportResponseDto } from "./dto/report-response.dto";
import { CheckRentResponseDto } from "./dto/check-rent-response.dto";
import { RentResponseDto } from "./dto/rent-response.dto";

@Injectable()
export class RentService {
  constructor(private readonly dbService: DbService) {
  }

  private async isNotRented({ end_session, id, start_session }: RentRequestDto) {
    const startDateWithInterval = moment(start_session).subtract(3, "days").format("YYYY-MM-DD");
    const endDateWithInterval = moment(end_session).add(3, "days").format("YYYY-MM-DD");

    const rentCars = await this.dbService.executeQuery<undefined>(
      `SELECT *
       FROM rent
       WHERE car_id = $1
         AND ((start_session BETWEEN $2 AND $3)
           OR (end_session BETWEEN $2 AND $3)
           OR (start_session <= $2 AND end_session >= $3))`,
      [id, startDateWithInterval, endDateWithInterval]);

    return rentCars.length === 0;
  }

  private async sessionPrice({ start_session, end_session }: Omit<RentRequestDto, "id">) {
    const start = moment(start_session, "YYYY-MM-DD");
    const end = moment(end_session, "YYYY-MM-DD");

    const days = moment.duration(end.diff(start)).asDays();

    const basePrice = await this.dbService
      .executeQuery<{ price: number }>(
        `SELECT price FROM prices WHERE alias = $1`, ["base_tariff"]
      )
      .then(e => e[0].price);

    const tariffs = await this.dbService.executeQuery<TariffsModel>(`SELECT *
                                                                     FROM tariffs`);
    const sortedTariffs = tariffs.sort((a, b) => b.percent_sale - a.percent_sale);

    let price = 0;

    for (let d = days; d > 0; d--) { // days each

      for (let i = 0; i <= sortedTariffs.length; i++) { // sales each

        if (i === sortedTariffs.length) {
          price += basePrice;
          break;
        }

        if (sortedTariffs[i].start_date <= d && d <= sortedTariffs[i].end_date) {
          price += basePrice * ((100 - sortedTariffs[i].percent_sale) / 100);
          break;
        }
      }
    }

    return price;
  }

  async checkCarRent({ start_session, id, end_session }: RentRequestDto) {
    const isNotRented = await this.isNotRented({ start_session, id, end_session });

    if (!isNotRented) {
      return new CheckRentResponseDto(null, true);
    }

    const price = await this.sessionPrice({ start_session, end_session });

    return new CheckRentResponseDto(price, false);
  }

  async rentCar({ start_session, id, end_session }: RentRequestDto) {
    const isNotRented = await this.isNotRented({ start_session, id, end_session });

    if (!isNotRented) {
      return new RentResponseDto(true, id, start_session, end_session, null);
    }

    const price = await this.sessionPrice({ start_session, end_session });

    try {
      await this.dbService.executeQuery<RentModel>(
        `INSERT INTO rent (car_id, start_session, end_session, price)
         VALUES ($1, $2, $3, $4)
         RETURNING id, car_id, start_session, end_session, price`,
        [id, start_session, end_session, price]
      );

      return new RentResponseDto(false, id, start_session, end_session, price);
    } catch (e) {
      throw e;
    }
  }

  async rentReport(date: string) {
    const daysInMonth = moment(date, "YYYY-MM").daysInMonth();

    try {
      return this.dbService.executeQuery<ReportResponseDto>(
        `
            SELECT c.car_name,
                   c.car_number,
                   SUM(round(rent_lat.counter * (100 / $2))) AS rent_percent
            FROM cars c
                     LEFT JOIN rent r on c.id = r.car_id
                     left JOIN LATERAL
                (SELECT to_char(gs, 'YYYY-MM') as year_month,
                        count(gs)              as counter
                 FROM generate_series(r.start_session, r.end_session, interval '1 day') gs
                 GROUP BY year_month
                ) rent_lat ON TRUE

            WHERE rent_lat.year_month = $1

            group BY rent_lat.year_month, c.car_name, c.car_number
            ORDER BY rent_lat.year_month
        `,
        [date, daysInMonth]
      );
    } catch (e) {
      throw e;
    }
  }
}
