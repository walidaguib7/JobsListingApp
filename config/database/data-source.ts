import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  database: 'jobsListing',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/config/database/migrations/*.js'],
  username: 'root',
  host: 'localhost',
  password: 'ninamimo23@@',
  synchronize: false,
  migrationsTableName: 'data_migration',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
