import { Inject, Injectable } from "@nestjs/common";
import { Pool, QueryResult } from "pg";
import { PG_CONNECTION } from './constans';

@Injectable()
export class DbService {
  constructor(@Inject('PG_CONNECTION') private pool: Pool) {}

  executeQuery(queryText: string, values: any[] = []): Promise<any[]> {
    return this.pool.query(queryText, values).then((result: QueryResult) => {
      return result.rows;
    });
  }
}