/*
https://docs.nestjs.com/providers#services
*/

import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { HashingProvider } from './providers/hashing.provider';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import authConfig from './config/auth.config';
import type { ConfigType } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh.token.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly userService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: CreateUserDto) {
    const exists = await this.userService.findByEmail(dto.email);

    if (exists) throw new ConflictException();

    const hashed = await this.hashingProvider.hash(dto.password);

    const user = await this.userService.create({
      ...dto,
      password: hashed,
    });

    const { password, ...rest } = user;
    return {
      message: 'user sign up success',
      rest,
    };
  }

  async login(dto: LoginUserDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new NotFoundException();

    const isValid = await this.hashingProvider.compare(
      dto.password,
      user.password,
    );

    if (!isValid) throw new UnauthorizedException('invalid credentials');

    const { password, refreshToken, ...rest } = user;

    const tokens = await this.generateTokens(user);
    await this.updateRefreshTokens(user.id, tokens.refreshToken);
    return {
      message: 'login success',
      ...rest,
      tokens,
    };
  }

  async logout(userId: string) {
    await this.userService.update(userId, { refreshToken: null });

    return {
      message: 'user logot success',
    };
  }

  async generateTokens(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.authConfiguration.secret,
        expiresIn: this.authConfiguration.expiresIn as any,
      }),

      this.jwtService.signAsync(payload, {
        secret: this.authConfiguration.refresh_secret,
        expiresIn: this.authConfiguration.refresh_expiresIn as any,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(dto: RefreshTokenDto) {
    const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
      secret: this.authConfiguration.refresh_secret,
    });

    const user = await this.userService.findOne(payload.id);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException();
    }

    const match = await this.hashingProvider.compare(
      dto.refreshToken,
      user.refreshToken,
    );

    if (!match) throw new UnauthorizedException();

    const tokens = await this.generateTokens(user);
    await this.updateRefreshTokens(user.id, tokens.refreshToken);

    return tokens;
  }

  private async updateRefreshTokens(userId: string, refreshToken: string) {
    const hashed = await this.hashingProvider.hash(refreshToken);
    await this.userService.update(userId, { refreshToken: hashed });
  }
}
