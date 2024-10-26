import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { LogService } from '../services/log.service';
import { InternalAccessGuard } from 'src/guards/internal-access.guard';
import { CreateLogDTO } from '../dto/create-log.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('log')
export class LogController {
    constructor(
        private readonly logService: LogService,
    ) { }

    @ApiExcludeEndpoint()
    @Post('/')
    @UseGuards(InternalAccessGuard)
    store(@Body() createlogDTO: CreateLogDTO) {
        return this.logService.store(createlogDTO);
    }

    @ApiTags('Logs')
    @ApiOperation({ summary: 'Gets a history of actions of registered users. Only registered users have access to this endpoint.' })
    @Get('/')
    @UseGuards(AuthGuard)
    getAll(@Query('userName') userName?: string, @Query('date') date?: string, @Query('action') action?: string, @Query('page') page: number = 1,) {
        let filterParams = {
            userName,
            date,
            action,
            page
        };
        return this.logService.findAll(filterParams);
    }
}
