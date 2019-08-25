import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async signUp(data: AuthCredentialsDto): Promise<void> {
    const {username, password} = data;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('Username already exist!');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(data: AuthCredentialsDto): Promise<string> {
    const {username, password} = data;
    const user = await this.findOne({username});

    if (user && await user.validatePassword(password)) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

}
