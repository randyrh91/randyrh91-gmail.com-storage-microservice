import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import { CreateImageDTO } from 'src/image/dto/create-image.dto';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { TypeEnum } from '../enums/type.enum';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ImageResponse } from '../response/image-response.dto';

@Injectable()
export class FirebaseService {

  private readonly apiKey: string;
  private readonly urlImageBase: string;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly httpService: HttpService, private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('IMAGE_API_SECRET_KEY');
    this.urlImageBase = this.configService.get<string>('IMAGE_API_URL_BASE');

    const serviceAccount = {
      type: configService.get<string>('FIREBASE_TYPE'),
      projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
      privateKeyId: configService.get<string>('FIREBASE_PRIVATE_KEY_ID'),
      privateKey: configService.get<string>('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
      clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
      clientId: configService.get<string>('FIREBASE_CLIENT_ID'),
      authUri: configService.get<string>('FIREBASE_AUTH_URI'),
      tokenUri: configService.get<string>('FIREBASE_TOKEN_URI'),
      authProviderX509CertUrl: configService.get<string>('FIREBASE_AUTH_PROVIDER_URL'),
      clientX509CertUrl: configService.get<string>('FIREBASE_CLIENT_X509_CERT_URL'),
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: 'gs://storage-microservice-8053d.appspot.com',
    });
  }

  async retrievalAll(filterParams?: { userName?: string; date?: string; page: number }): Promise<ImageResponse[]> {
    
    const cachedData = await this.cacheManager.get<ImageResponse[]>('retrievalAll');
    if (cachedData) {
      return cachedData;  
    }  
    
    const url = this.urlImageBase;
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: filterParams,
          headers: {
            "internal-access": this.apiKey,
          },
        }),
      );
      const images: ImageResponse [] = [];
      const imagesSearched = response.data;
      const bucket = admin.storage().bucket();

      for (const imageSearched of imagesSearched) { 

        const file = bucket.file(imageSearched.filename);
        const fileExists = await file.exists();

        if (!fileExists[0]) {
          throw new NotFoundException('Image not found');
        }

        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 1000 * 60 * 60,
        });

        const image: ImageResponse = {
          id: imageSearched.id,
          name: imageSearched.name,
          type: TypeEnum.IMAGE,
          createdAt: imageSearched.createdAt,
          url: url,
          uploadBy: imageSearched.user.userName,
        };
        images.push(image);
      };
      await this.cacheManager.set('retrievalAll', images);
      return images;

    } catch (error) {
      throw new Error('Could not get any image');
    }
  }

  async retrieval(filename: string): Promise<ImageResponse> {

    const cachedData = await this.cacheManager.get<ImageResponse>('retrieval');
    if (cachedData) {
      return cachedData;  
    }  

    const url = this.urlImageBase + filename;
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            "internal-access": this.apiKey,
          },
        }),
      );

      const imageSearched = response.data;
      if (imageSearched) {
        const bucket = admin.storage().bucket();
        const file = bucket.file(imageSearched.filename);
        const fileExists = await file.exists();
        if (!fileExists[0]) {
          throw new NotFoundException('Image not found');
        }

        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 1000 * 60 * 60,
        });

        const image: ImageResponse = {
          id: imageSearched.id,
          name: imageSearched.name,
          type: TypeEnum.IMAGE,
          createdAt: imageSearched.createdAt,
          url: url,
          uploadBy: imageSearched.user.userName,
        };

        await this.cacheManager.set('retrieval', image);
        return image;

      } else {
        throw new NotFoundException('Image not found');
      }
    } catch (error) {
      console.log(error);
      throw new Error('Could not get image');
    }
  }

  async retrievalMini(filename: string, width: number, height: number): Promise<ImageResponse> {
    
    const cachedData = await this.cacheManager.get<ImageResponse>('retrieval-mini');
    if (cachedData) {
      return cachedData;  
    }  

    const url = this.urlImageBase + filename;
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            "internal-access": this.apiKey,
          },
        }),
      );
      const imageSearched = response.data;
      if (imageSearched) {
        const bucket = admin.storage().bucket();
        const file = bucket.file(imageSearched.filename);
        const fileExists = await file.exists();
        if (!fileExists[0]) {
          throw new NotFoundException('Thumbnail not found');
        }

        const readStream = file.createReadStream();
        const resizeStream = readStream.pipe(sharp().resize(Number(width), Number(height)).toFormat('jpg'));

        const newFilePath = `resized-${width}x${height}-${imageSearched.filename}`;
        const newFile = bucket.file(newFilePath);

        const writeStream = newFile.createWriteStream({
          metadata: {
            contentType: 'image/jpeg',
          },
        });

        await new Promise((resolve, reject) => {
          resizeStream.pipe(writeStream)
            .on('error', reject)
            .on('finish', resolve);
        });

        const [url] = await newFile.getSignedUrl({
          action: 'read',
          expires: Date.now() + 1000 * 60 * 60,
        });

        const image: ImageResponse = {
          id: imageSearched.id,
          name: imageSearched.name,
          type: TypeEnum.THUMBNAIL,
          createdAt: imageSearched.createdAt,
          url: url,
          uploadBy: imageSearched.user.userName,
        };

        await this.cacheManager.set('retrieval-mini', image);
        return image;

      } else {
        throw new NotFoundException('Thumbnail not found');
      }
    } catch (error) {
      throw new Error('Could not get thumbnail');
    }
  }

  async upload(file: Express.Multer.File, user: CreateUserDTO): Promise<string> {

    const bucket = admin.storage().bucket();
    const fileName = `${uuidv4()}_${file.originalname}`;

    await bucket.upload(file.path, {
      destination: fileName,
      metadata: {
        contentType: file.mimetype,
      },
    });

    try {

      const urlImage = this.urlImageBase;

      var imageDto = new CreateImageDTO();
      imageDto.name = file.originalname;
      imageDto.filename = fileName;
      imageDto.description = '';
      imageDto.isPublished = true;
      imageDto.createdAt = new Date();
      imageDto.user = user;

      const imageStored = await firstValueFrom(
        this.httpService.post(urlImage, imageDto, {
          headers: {
            "internal-access": this.apiKey,
          },
        }),
      );
      if (imageStored.data) {
        return "File uploaded";
      }
    } catch (error) {
      throw new Error('Could not store image');
    }
    throw new Error('Could not store image');
  }

  async delete(filename: string): Promise<string> {

    const urlImage = this.urlImageBase + filename;
    try {
      const imageSearched = await firstValueFrom(
        this.httpService.get(urlImage, {
          headers: {
            "internal-access": this.apiKey,
          },
        }),
      );

      if (imageSearched.data) {
        const bucket = admin.storage().bucket();
        await bucket.file(imageSearched.data.filename).delete();
        await firstValueFrom(
          this.httpService.delete(urlImage, {
            headers: {
              "internal-access": this.apiKey,
            },
          }),
        );
        return "Image was deleted";
      }
    } catch (error) {
      throw new Error('Could not delete image');
    }
    throw new NotFoundException('Image not found');
  }
}
