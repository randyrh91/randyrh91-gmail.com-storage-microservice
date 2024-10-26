import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ImageService } from '../services/image.service';
import { CreateImageDTO } from '../dto/create-image.dto';
import { InternalAccessGuard } from '../../guards/internal-access.guard';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('image/store')
export class ImageController {

    constructor(
        private readonly imageService: ImageService,
    ) { }

    @ApiExcludeEndpoint()
    @Post('/')
    @UseGuards(InternalAccessGuard)
    store(@Body() createImageDTO: CreateImageDTO) {
        return this.imageService.store(createImageDTO);
    }

    @ApiExcludeEndpoint()
    @Get('/')
    @UseGuards(InternalAccessGuard)
    getAll(@Query('userName') userName?: string, @Query('date') date?: string, @Query('page') page: number = 1) {
        let filterParams = {
            userName,
            date,
            page
        };
        return this.imageService.findAll(filterParams);
    }

    @ApiExcludeEndpoint()
    @Get('/:name')
    @UseGuards(InternalAccessGuard)
    getOneByName(@Param('name') name: string) {
        return this.imageService.findOneByName(name);
    }

    @ApiExcludeEndpoint()
    @Delete('/:name')
    @UseGuards(InternalAccessGuard)
    deleteByName(@Param('name') name: string) {
        return this.imageService.removeByName(name);
    }
}
