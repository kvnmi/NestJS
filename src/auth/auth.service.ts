import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable({})
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async login({ password, email }: RegDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Incorrect username or password');
    }

    const pwMatches = argon.verify(user.hash, password);

    if (!pwMatches) {
      throw new ForbiddenException('Incorrect username or password');
    }

    delete user.hash;
    const token = await this.signToken(user);
    return {
      status: HttpStatus.OK,
      data: {
        access_token: token,
      },
    };
  }

  async signUp({ password, email }: RegDto) {
    try {
      const hash = await argon.hash(password);
      const user = await this.prismaService.user.create({
        data: {
          email,
          hash,
        },
        /*select: {
          email: true,
          hash: true,
        },*/ // filter properties you want to return
      });

      delete user.hash;
      return {
        status: HttpStatus.CREATED,
        message: 'User created successfully',
      };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('Email taken');
        }
      }
      throw e;
    }
  }

  signToken(user: User): Promise<string> {
    try {
      const payload = {
        sub: user.id,
        user,
      };

      return this.jwt.signAsync(payload, {
        secret: this.config.get('SECRET'),
        expiresIn: '15m',
      });
    } catch (error) {
      throw new ServiceUnavailableException(
        'Service unavailable',
        'Internal server error',
      );
    }
  }
}
