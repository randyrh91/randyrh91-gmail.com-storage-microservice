import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { REPOSITORY_CONSTANTS } from '../util/constants';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterUserDTO } from '../dto/register-user.dto';
import * as bcryptjs from "bcryptjs";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    
    constructor(
        @Inject(REPOSITORY_CONSTANTS.USER_REPOSITORY)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async register({ userName, password }: RegisterUserDTO) {

        const user = await this.userRepository.findOneBy({ userName });
        if (user) {
            return new BadRequestException("user already exist");
        }
        const userEntity = await this.userRepository.create({ userName: userName, password: await bcryptjs.hash(password, 10), createdAt: new Date()});
        return this.userRepository.save(userEntity);
    }

    async findOneByUserName(userName: string) {
        const user = await this.userRepository.findOneBy({ userName });
        if(user){
            return {
                "id": user.id,
                "username": user.userName
            }
        }else{
            return null;
        }
        
    }

    async login({ userName, password }: RegisterUserDTO) {
        const user = await this.userRepository.findOneBy({ userName });
        if (!user) {
            return new UnauthorizedException("bad credentials");
        }
        const isPassValid = await bcryptjs.compare(password, user.password);
        if (!isPassValid) {
            return new UnauthorizedException("bad credentials");
        }

        const payload = {id: user.id, userName: user.userName };
        const token = await this.jwtService.signAsync(payload);
        
        return {
            token: token,
            name: user.userName,
        };
    }
}
