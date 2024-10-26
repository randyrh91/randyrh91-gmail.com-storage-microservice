import { Exclude, Expose } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateUserDTO {
    
    @Expose() 
    @IsNumber()
    id: number

    @Expose() 
    @IsString()
    userName?: string;

    @Exclude()
    @IsString()
    password?: string;

    @Exclude()
    @IsDate()
    createdAt?: Date;
}