import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InternalAccessGuard implements CanActivate {

  private readonly apiKey: string;  

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('IMAGE_API_SECRET_KEY'); 
  } 

  async canActivate(context: ExecutionContext,): Promise<boolean> {
    const request = context.switchToHttp().getRequest();  
    return request.headers['internal-access'] === this.apiKey;
  }
}
