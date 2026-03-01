import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource,) {}
  async getHello(): Promise<number> {
    return await this.dataSource.manager.query('SELECT COUNT(*) FROM users');
  }
}
