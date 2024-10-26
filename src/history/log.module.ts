import { Module } from '@nestjs/common';
import { LogController } from './controllers/log.controller';
import { LogService } from './services/log.service';
import { Log } from './entities/log.entity';
import { CreateLogDTO } from './dto/create-log.dto';
import { databaseProviders } from 'src/database/database.providers';
import { logProviders } from './repository/log.providers';

@Module({
  imports: [Log, CreateLogDTO],
  controllers: [LogController],
  providers: [...databaseProviders, ...logProviders, LogService]
})
export class LogModule {}
