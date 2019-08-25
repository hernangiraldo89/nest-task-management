import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './respositories/user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './models/jwt-payload.interface';
import { JwtResponse } from './models/jwt-response.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(data: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(data);
  }

  async signIn(data: AuthCredentialsDto): Promise<JwtResponse> {
    const username = await this.userRepository.validateUserPassword(data);

    if (!username) {
      throw new UnauthorizedException(`Invalid credentials`);
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }

}
