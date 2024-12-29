import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotnev from 'dotenv';

dotnev.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  database: 'Jobs',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/config/database/migrations/*.js'],
  username: 'postgres',
  host: 'db',
  port: 5432,
  password: 'postgres',
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
