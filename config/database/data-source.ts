import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  database: 'Jobs',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/config/database/migrations/*.js'],
  username: 'postgres',
  host: 'localhost',
  port: 5432,
  password: 'walidaguib',
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
