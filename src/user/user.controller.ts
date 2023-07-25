import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { GetUser } from 'src/auth/decorators/userDecorator';
import { JWTGaurd } from 'src/auth/gaurd/jwt.guard';

@UseGuards(JWTGaurd)
@Controller('user')
export class UserController {
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async getProfileInfo(@GetUser() user, @GetUser('createdAt') createdAt) {
    console.log(createdAt);

    return {
      data: {
        user,
      },
    };
  }
}
