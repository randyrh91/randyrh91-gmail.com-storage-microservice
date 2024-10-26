import { Transform } from "class-transformer";
import { IsString, MinLength } from "class-validator";

export class LoginUserDTO {
    
    @IsString()
    userName?: string;
    
    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(8)
    password?: string;
}