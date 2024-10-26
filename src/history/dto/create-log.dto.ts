import {IsDate, IsNumber, IsString } from "class-validator";
import {Expose } from "class-transformer";
import { CreateImageDTO } from "src/image/dto/create-image.dto";
import { CreateUserDTO } from "src/user/dto/create-user.dto";

export class CreateLogDTO {
    
    @Expose()  
    @IsNumber()
    id: number;

    @Expose()  
    @IsString()
    action: string;

    @Expose()  
    user: CreateUserDTO;

    @Expose()  
    image: CreateImageDTO;

    @Expose()
    @IsDate()
    date: Date;
}