import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { userProviders } from './repositories/user.providers';
import { UserService } from './services/user.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { databaseProviders } from 'src/database/database.providers';
import { AuthController } from './controllers/auth/auth.controller';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONSTANTS } from './util/constants';
import { CreateUserDTO } from './dto/create-user.dto';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: JWT_CONSTANTS.SECRET_KEY,
    signOptions: { expiresIn: "1d" },
  }),
  User, UpdateUserDTO, RegisterUserDTO, LoginUserDTO, CreateUserDTO],
  providers: [...databaseProviders, ...userProviders, UserService],
  controllers: [UserController, AuthController],
})
export class UserModule { }
