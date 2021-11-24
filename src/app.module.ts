import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { RentModule } from './rent/rent.module';

@Module({
  imports: [
    DbModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./.env'],
    }),
    RentModule
  ],
})
export class AppModule {}
