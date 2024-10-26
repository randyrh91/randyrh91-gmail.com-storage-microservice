import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { FirebaseModule } from './firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ImageModule } from './image/image.module';
import { UserModule } from './user/user.module';
import { LogModule } from './history/log.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  CacheModule.register({   
    store: require('cache-manager-ioredis'),  
    host: 'localhost',  // Cambia esto si es necesario  
    port: 6379,         // Cambia esto si usas un puerto diferente  
    ttl: 600, 
    isGlobal: true,          // Tiempo de vida en segundos  
  }),  
  RedisModule.forRoot({
    type: 'single',
    url: 'redis://localhost:6379',
  }), 
  UserModule, DatabaseModule, FirebaseModule, ImageModule, LogModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
