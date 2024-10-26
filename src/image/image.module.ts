import { Module } from '@nestjs/common';
import { ImageController } from './controllers/image.controller';
import { ImageService } from './services/image.service';
import { Image } from './entities/image.entity';
import { CreateImageDTO } from './dto/create-image.dto';
import { UpdateImageDTO } from './dto/update-image.dto';
import { databaseProviders } from 'src/database/database.providers';
import { imageProviders } from './repositories/image.providers';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [Image, CreateImageDTO, UpdateImageDTO, HttpModule],
    providers: [...databaseProviders, ...imageProviders, ImageService],
    controllers: [ImageController],
})
export class ImageModule {}
