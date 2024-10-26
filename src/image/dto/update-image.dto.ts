import { IsString } from "class-validator";

export class UpdateImageDTO {
    
    @IsString()
    name?: string;
    
    description?: string;
    
    filename?: string;
    
    views?: number;
    
    isPublished?: boolean;
}