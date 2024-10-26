import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { InternalAccessGuard } from 'src/guards/internal-access.guard';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService,
    ) { }

    @ApiExcludeEndpoint()
    @Get('/:userName')
    @UseGuards(InternalAccessGuard)
    getOneByUserName(@Param('userName') userName: string) {
        return this.userService.findOneByUserName(userName);
    }
}
