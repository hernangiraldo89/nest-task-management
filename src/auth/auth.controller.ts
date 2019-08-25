import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { JwtResponse } from './models/jwt-response.interface';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
  ) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) data: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(data);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) data: AuthCredentialsDto): Promise<JwtResponse> {
    return this.authService.signIn(data);
  }

}
