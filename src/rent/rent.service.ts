import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CheckRentRequestDto } from './dto/check-rent-request-dto';

@Injectable()
export class RentService {
  constructor(private readonly dbService: DbService) { }

  async checkRent(dto: CheckRentRequestDto) {
    return this.dbService.executeQuery('SELECT * FROM car WHERE id=$1', [dto.id])
  }
}
