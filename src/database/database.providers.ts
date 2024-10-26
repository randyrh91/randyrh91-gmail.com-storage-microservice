import { DataSource } from 'typeorm';
import { REPOSITORY_CONSTANTS } from './util/constants';

export const databaseProviders = [
  {
    provide: REPOSITORY_CONSTANTS.DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'storage-microservice-db',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../**/*.migration{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
