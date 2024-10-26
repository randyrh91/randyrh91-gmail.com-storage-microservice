import { Controller, Get, Param, Post, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Res, Request, Delete, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../services/firebase.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ImageResponse } from '../response/image-response.dto';

@Controller('/image')
export class FirebaseController {

  constructor(private readonly firebaseService: FirebaseService) { }

  @ApiTags('Images')
  @ApiOperation({ summary: 'Gets all the images available for download. This is the starting point of the API' })
  @Get('/retrieval')
  async retrievalAll(@Query('userName') userName?: string, @Query('date') date?: string, @Query('page') page: number = 1): Promise<ImageResponse[]>  {
    let filterParams = {
      userName,
      date,
      page
    };
    return this.firebaseService.retrievalAll(filterParams);
  }

  @ApiTags('Images')
  @ApiOperation({ summary: 'Gets an image from its name. The name can be found in the endpoint "api/v1/image/retrieval"' })
  @Get('/retrieval/:filename')
  async retrieval(@Param('filename') filename: string): Promise<ImageResponse> {
    return this.firebaseService.retrieval(filename);
  }

  @ApiTags('Images')
  @ApiOperation({ summary: 'Gets an thumbnail from its name. The name can be found in the endpoint "api/v1/image/retrieval"' })
  @Get('/mini/retrieval/:filename')
  async retrievalMini(@Param('filename') filename: string, @Query('width') width: number, @Query('height') height: number): Promise<ImageResponse>  {
    if (!width || !height ) {  
      throw new BadRequestException('width and height parameters are required');  
    } 
    return this.firebaseService.retrievalMini(filename, width, height);
  }

  @ApiTags('Images')
  @ApiOperation({ summary: 'Allows to upload a new image. Only registered users have access to this endpoint' })
  @Post('/upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(new BadRequestException('File type not allowed'), false);
      }
      callback(null, true);
    },
  }))
  async upload(@UploadedFile() file: Express.Multer.File, @Request() request: any): Promise<string>  {
    const user = request.user;
    return this.firebaseService.upload(file, user);
  }

  @ApiTags('Images')
  @ApiOperation({ summary: 'Allows to remove an existan image. Only registered users have access to this endpoint' })
  @Delete('/delete/:filename')
  @UseGuards(AuthGuard)
  async delete(@Param('filename') filename: string): Promise<string> {
    return this.firebaseService.delete(filename);
  }

}
