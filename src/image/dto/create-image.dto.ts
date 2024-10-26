import { IsBoolean, IsDate, IsNumber, IsString } from "class-validator";
import { Exclude, Expose } from "class-transformer";
import { CreateUserDTO } from "src/user/dto/create-user.dto";

export class CreateImageDTO {
    
    @Expose()  
    @IsNumber()
    id: number;

    @Expose()  
    @IsString()
    name: string;
    
    @Exclude()
    @IsString()
    description: string;
    
    @Expose()
    @IsString()
    filename: string;
    
    @Exclude()
    @IsBoolean()
    isPublished: boolean;

    @Expose()
    @IsDate()
    createdAt: Date;

    @Expose()  
    user: CreateUserDTO;
}