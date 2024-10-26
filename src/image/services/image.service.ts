import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Image } from '../entities/image.entity';
import { CreateImageDTO } from '../dto/create-image.dto';
import { plainToClass } from 'class-transformer';
import { REPOSITORY_CONSTANTS } from '../util/constants';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { CreateLogDTO } from 'src/history/dto/create-log.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ActionEnum } from '../enums/action.enum';

@Injectable()
export class ImageService {

    private readonly apiKey: string;
    private readonly urlLogBase: string;

    constructor(
        @Inject(REPOSITORY_CONSTANTS.IMAGE_REPOSITORY)
        private imageRepository: Repository<Image>,
        private readonly httpService: HttpService,
        private configService: ConfigService
    ) {
        this.apiKey = this.configService.get<string>('IMAGE_API_SECRET_KEY');
        this.urlLogBase = this.configService.get<string>('LOG_API_URL_BASE');
    }

    async store(image: CreateImageDTO) {

        const connection = this.imageRepository.manager.connection;

        await connection.transaction(async (entityManager) => {
            const imageEntity = await this.imageRepository.create(image);
            const imageCreated = await this.imageRepository.save(imageEntity);
            try {

                var logDto = new CreateLogDTO();
                logDto.image = imageCreated;
                logDto.user = imageCreated.user;
                logDto.action = ActionEnum.UPLOAD_IMAGE;
                logDto.date = new Date();

                await firstValueFrom(
                    this.httpService.post(this.urlLogBase, logDto, {
                        headers: {
                            "internal-access": this.apiKey,
                        },
                    }),
                );
                return imageCreated;
            } catch (error) {
                throw new Error('Could not log action');
            }
        });
    }

    async findAll(filterParams: { userName?: string; date?: string, page: number }) {

        const take = 10;
        const skip = (filterParams.page - 1) * take;
        
        const query = this.imageRepository.createQueryBuilder('image')  
            .where('image.is_published = :isPublished', { isPublished: true })
            .leftJoinAndSelect('image.user', 'user');
    
        if (filterParams.userName) {
            query.andWhere('user.userName = :userName', { userName: filterParams.userName });
        }

        if (filterParams.date) {
            query.andWhere('DATE(image.created_at) = DATE(:createdAt)', { createdAt: filterParams.date });
        }

        const images = await query.skip(skip).take(take).getMany();

        const imagesMap = images.map(
            (img: Image) => {
                const imgDto = plainToClass(CreateImageDTO, img, { excludeExtraneousValues: true });
                imgDto.user = plainToClass(CreateUserDTO, img.user, { excludeExtraneousValues: true });
                return imgDto;
            });

        return imagesMap;
    }

    async findOne(id: number) {
        return await this.imageRepository.findOneBy({ id });
    }

    async findOneByName(name: string) {
        return await this.imageRepository.findOneBy({ name });
    }

    async remove(id: number) {
        const image = await this.imageRepository.delete({ id });
        return image;
    }

    async removeByName(name: string) {

        const connection = this.imageRepository.manager.connection;
        await connection.transaction(async (entityManager) => {
            const image = await this.findOneByName(name);
            image.isPublished = false;
            const imageDeleted = await this.imageRepository.save(image);

            try {

                var logDto = new CreateLogDTO();
                logDto.image = image;
                logDto.user = image.user;
                logDto.action = ActionEnum.DELETE_IMAGE;
                logDto.date = new Date();

                await firstValueFrom(
                    this.httpService.post(this.urlLogBase, logDto, {
                        headers: {
                            "internal-access": this.apiKey,
                        },
                    }),
                );
                return imageDeleted;
            } catch (error) {
                throw new Error('Could not log action');
            }
        });
    }
}
