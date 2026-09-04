/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { CurrentUser } from 'src/common/decorators/current.user.decorator';
import { User } from 'src/users/entities/user.entity';
import { RefreshTokenDto } from './dto/refresh.token.dto';
import { JwtAuthGuard } from './guard/jwt.auth.guard';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'sign up user' })
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'login user' })
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'logout user' })
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'refresh tokens' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'get current user' })
  getMe(@CurrentUser() user: User) {
    return user;
  }
}
