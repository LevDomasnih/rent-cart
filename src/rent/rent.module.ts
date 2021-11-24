import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [RentService],
  controllers: [RentController]
})
export class RentModule {}
