import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dtos/create.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findbyUsername(username);

    const isMatch = await bcrypt.compare(pass, user.passwordHash);

    if (user && isMatch) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async SignUp(dto: CreateUserDto): Promise<void> {
    await this.userService.createUser(dto);
  }

  async login(user: User) {
    const payload = {
      username: user.username,
      sub: user.userId,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
