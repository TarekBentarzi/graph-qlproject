// auth.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as qs from 'qs';

@Controller('auth')
export class AuthController {
  constructor(private readonly httpService: HttpService) {}

  @Get('callback')
  async callback(@Query('code') code: string) {
    const clientId = '7co1bgbr4vdi4a6otain960tbk';
    const clientSecret = '1h8sjlk4vnj47hdo03gmbd7meq0mkfssdmco2lkqahpr8on275eh';
    const redirectUri = 'http://localhost:3000/callback';

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const data = qs.stringify({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      redirect_uri: redirectUri,
    });

    const response = await lastValueFrom(
      this.httpService.post(
        'https://eu-central-1zlitkqnb8.auth.eu-central-1.amazoncognito.com/oauth2/token',
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${basicAuth}`,
          },
        }
      )
    );

    return response.data; // contient access_token, id_token, refresh_token, etc.
  }
}
