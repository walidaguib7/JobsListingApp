import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotnev from 'dotenv';

dotnev.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/config/database/migrations/*.js'],
  username: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  password: process.env.DB_PASSWORD,
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
