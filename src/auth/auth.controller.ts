import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { MainPathEndpoint, SubPathEndpoint } from 'src/utils';

@Controller(MainPathEndpoint.Auth)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(SubPathEndpoint.Get_Token)
  async getToken(@Body('password') password: string) {
    return this.authService.validatePasswordAndIssueToken(password);
  }
}
