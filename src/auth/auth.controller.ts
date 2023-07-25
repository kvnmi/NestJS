import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: RegDto) {
    return this.authService.signUp(dto);
  }

  @Post('login')
  login(@Body() dto: RegDto) {
    return this.authService.login(dto);
  }
}
