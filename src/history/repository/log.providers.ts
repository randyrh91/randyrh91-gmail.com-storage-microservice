import { DataSource } from 'typeorm';
import { REPOSITORY_CONSTANTS } from '../util/constants';
import { Log } from '../entities/log.entity';

export const logProviders = [
    {
        provide: REPOSITORY_CONSTANTS.LOG_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Log),
        inject: [REPOSITORY_CONSTANTS.DATA_SOURCE],
    },
];