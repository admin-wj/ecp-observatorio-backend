import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('get-token')
  async getToken(@Body('password') password: string) {
    return this.authService.validatePasswordAndIssueToken(password);
  }
}
