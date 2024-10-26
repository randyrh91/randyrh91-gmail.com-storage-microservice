import { IsString } from "class-validator";

export class UpdateUserDTO {
    
    @IsString()
    userName?: string;
    
    password?: string;
}