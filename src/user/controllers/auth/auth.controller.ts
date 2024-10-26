import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { RegisterUserDTO } from 'src/user/dto/register-user.dto';
import { LoginUserDTO } from 'src/user/dto/login-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly userService: UserService,
    ){}

    @ApiTags('Users')
    @ApiOperation({ summary: 'Register a new user in the API' })
    @UseGuards(AuthGuard)
    @Post('/register')
    register(@Body() registerUserDTO: RegisterUserDTO){
        return this.userService.register(registerUserDTO);
    }

    @ApiTags('Users')
    @ApiOperation({ summary: 'Log in a user in the API' })
    @Post('/login')
    login(@Body() loginUserDTO: LoginUserDTO){
        return this.userService.login(loginUserDTO);
    }
}
