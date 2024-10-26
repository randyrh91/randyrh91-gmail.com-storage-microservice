import { DataSource } from 'typeorm';
import { Image } from '../entities/image.entity';
import { REPOSITORY_CONSTANTS } from '../util/constants';

export const imageProviders = [
    {
        provide: REPOSITORY_CONSTANTS.IMAGE_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Image),
        inject: [REPOSITORY_CONSTANTS.DATA_SOURCE],
    },
];