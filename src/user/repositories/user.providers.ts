import { DataSource } from 'typeorm';
import { REPOSITORY_CONSTANTS } from '../util/constants';
import { User } from '../entities/user.entity';

export const userProviders = [
    {
        provide: REPOSITORY_CONSTANTS.USER_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
        inject: [REPOSITORY_CONSTANTS.DATA_SOURCE],
    },
];