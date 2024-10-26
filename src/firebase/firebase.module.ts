import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';  
import { MulterModule } from '@nestjs/platform-express';
import { FirebaseController } from './controllers/firebase.controller';
import { FirebaseService } from './services/firebase.service';
import { HttpModule } from '@nestjs/axios';

@Module({  
  imports: [
    MulterModule.register({  
      dest: './uploads',
    }),
    HttpModule   
  ],
  controllers: [FirebaseController],
  providers: [FirebaseService],  
})  
export class FirebaseModule {}
