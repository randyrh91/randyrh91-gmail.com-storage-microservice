import { Inject, Injectable } from '@nestjs/common';
import { CreateLogDTO } from '../dto/create-log.dto';
import { REPOSITORY_CONSTANTS } from '../util/constants';
import { FindManyOptions, Repository } from 'typeorm';
import { Log } from '../entities/log.entity';
import { format, parseISO } from 'date-fns';
import { plainToClass } from 'class-transformer';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { CreateImageDTO } from 'src/image/dto/create-image.dto';

@Injectable()
export class LogService {

    constructor(
        @Inject(REPOSITORY_CONSTANTS.LOG_REPOSITORY)
        private logRepository: Repository<Log>,
    ) { }

    async store(log: CreateLogDTO) {
        const logEntity = await this.logRepository.create(log);
        return this.logRepository.save(logEntity);
    }

    async findAll(filterParams: { userName?: string; date?: string; action?: string; page: number }) {
        
        const take = 10;
        const skip = (filterParams.page - 1) * take;

        const query = this.logRepository.createQueryBuilder('log')
            .leftJoinAndSelect('log.user', 'user')
            .leftJoinAndSelect('log.image', 'image');
    
        if (filterParams.action) {
            query.andWhere('log.action = :action', { action: filterParams.action });
        }

        if (filterParams.userName) {
            query.andWhere('user.userName = :userName', { userName: filterParams.userName });
        }

        if (filterParams.date) {
            query.andWhere('DATE(log.date) = DATE(:date)', { date: filterParams.date });
        }

        const logs = await query.skip(skip).take(take).getMany();

        const logsMap = logs.map(
            (log: Log) => {
                const logDto = plainToClass(CreateLogDTO, log, { excludeExtraneousValues: true });
                logDto.user = plainToClass(CreateUserDTO, log.user, { excludeExtraneousValues: true });
                logDto.image = plainToClass(CreateImageDTO, log.image, { excludeExtraneousValues: true });
                return logDto;
            });

        return logsMap;
    }
}
