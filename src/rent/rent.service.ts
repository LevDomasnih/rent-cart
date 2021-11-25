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
}
