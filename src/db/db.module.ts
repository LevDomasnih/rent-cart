import { Module } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Pool } from 'pg'
import { PG_CONNECTION } from './constans';
import { DbService } from './db.service';


const dbProvider = {
  provide: PG_CONNECTION,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return new Pool({
      user: configService.get('POSTGRES_USER'),
      password: configService.get('POSTGRES_PASSWORD'),
      database: configService.get('POSTGRES_DB'),
      port: configService.get('POSTGRES_LOCAL_PORT'),
      host: configService.get('POSTGRES_HOST'),
    });
  }
}

@Module({
  providers: [
    dbProvider,
    DbService,
  ],
  exports: [DbService]
})
export class DbModule {}
