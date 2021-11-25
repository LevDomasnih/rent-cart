import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CheckRentRequestDto } from './dto/check-rent-request-dto';
import * as moment from "moment";

//TODO вынести в базу
const sale = [
  {
    from: 5,
    to: 9,
    sale: 5
  },
  {
    from: 18,
    to: 29,
    sale: 15
  },
  {
    from: 10,
    to: 17,
    sale: 10
  },
]

const basePrice = 1000

@Injectable()
export class RentService {
  constructor(private readonly dbService: DbService) { }

  private async isNotRented({ end_session, id, start_session }: CheckRentRequestDto) {
    const startDateWithInterval = moment(start_session).subtract(3, 'days').format('YYYY-MM-DD');
    const endDateWithInterval = moment(end_session).add(3, 'days').format('YYYY-MM-DD');

    const rentCars = await this.dbService.executeQuery(
      `SELECT * FROM rent WHERE car_id=$1 
        AND ((start_session BETWEEN $2 AND $3) 
                 OR (end_session BETWEEN $2 AND $3) 
                 OR (start_session <= $2 AND end_session >= $3))`,
      [id, startDateWithInterval, endDateWithInterval])

    return rentCars.length === 0
  }

  private sessionPrice({ start_session, end_session }: Omit<CheckRentRequestDto, 'id'>) {
    const start = moment(start_session, "YYYY-MM-DD")
    const end = moment(end_session, "YYYY-MM-DD")

    const days = moment.duration(end.diff(start)).asDays()

    const sortedSales = sale.sort(( a, b ) => b.sale - a.sale);

    let price = 0

    for (let d = days; d > 0; d--) { // days each

      for (let i = 0; i <= sortedSales.length; i++) { // sales each

        if (i === sortedSales.length) {
          price += basePrice
          break;
        }

        if (sortedSales[i].from <= d && d <= sortedSales[i].to) {
          price += basePrice * ((100 - sortedSales[i].sale) / 100)
          break
        }
      }
    }

    return price
  }

  async checkCarRent({ start_session, id, end_session }: CheckRentRequestDto) {
    const isNotRented = await this.isNotRented({ start_session, id, end_session })

    if (!isNotRented) {
      return false
    }

    return this.sessionPrice({ start_session, end_session })
  }

  async rentCar({ start_session, id, end_session }: CheckRentRequestDto) {
    const isNotRented = await this.isNotRented({ start_session, id, end_session })

    if (!isNotRented) {
      return false
    }

    const price = this.sessionPrice({ start_session, end_session })

    try {
      return this.dbService.executeQuery(
        `INSERT INTO rent (car_id, start_session, end_session, price) VALUES ($1, $2, $3, $4) 
                    RETURNING id, car_id, start_session, end_session, price`,
        [id, start_session, end_session, price]
      ).then(e => e[0])
    } catch (e) {
      throw e
    }
  }

  async rentReport(date: string) {

    const daysInMonth = moment(date, "YYYY-MM").daysInMonth()

    try {
      return this.dbService.executeQuery(
        `
            SELECT
                c.car_name, c.car_number, SUM(rent_lat.counter) AS rent_percent
            FROM
                car c
                    LEFT JOIN rent r on c.id = r.car_id
                    left JOIN LATERAL
                    (SELECT
                         to_char(gs,'YYYY-MM') as year_month,
                         count(gs) as counter
                     FROM generate_series(r.start_session, r.end_session, interval '1 day') gs
                     GROUP BY year_month
                    ) rent_lat ON TRUE

            WHERE rent_lat.year_month = $1

            group BY rent_lat.year_month, c.car_name, c.car_number ORDER BY rent_lat.year_month
        `,
        [date]
      ).then(e => e.map(c => {
        const percentIdDay = 100 / daysInMonth
        c.rent_percent = Math.round(c.rent_percent * percentIdDay)

        return c
      }))
    } catch (e) {
      throw e
    }
  }
}
