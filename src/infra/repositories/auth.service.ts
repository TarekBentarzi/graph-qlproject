import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as qs from 'qs';

@Injectable()
export class AuthService {
  private readonly clientId = '7co1bgbr4vdi4a6otain960tbk';
  private readonly clientSecret = '1h8sjlk4vnj47hdo03gmbd7meq0mkfssdmco2lkqahpr8on275eh';
  private readonly redirectUri = 'http://localhost:3000/callback';
  private readonly domain = 'https://eu-central-1zlitkqnb8.auth.eu-central-1.amazoncognito.com';

  async exchangeCodeForToken(code: string) {
    const tokenUrl = `${this.domain}/oauth2/token`;

    const data = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
    };

    const authHeader = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const response = await axios.post(tokenUrl, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authHeader}`,
      },
    });

    return response.data;
  }
}
