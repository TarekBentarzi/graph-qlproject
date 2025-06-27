import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as qs from 'qs';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {

  private readonly clientId : string ;
  private readonly clientSecret :string ;
  private readonly redirectUri:string ;
  private readonly domain: string;
   constructor(private readonly config: ConfigService) {
const clientId = this.config.get<string>('COGNITO_CLIENT_ID');
if (!clientId) {
  throw new Error('COGNITO_CLIENT_ID is not defined in environment variables');
}
  const clientSecret = this.config.get<string>('COGNITO_CLIENT_SECRET');
  if (!clientSecret) {
    throw new Error('COGNITO_CLIENT_SECRET is not defined in environment variables');
  }
  this.clientSecret = clientSecret;

  const domain = this.config.get<string>('COGNITO_DOMAIN');
  if (!domain) {
    throw new Error('COGNITO_DOMAIN is not defined in environment variables');
  }
  this.domain = domain;

  const redirectUri = this.config.get<string>('COGNITO_REDIRECT_URI');
  if (!redirectUri) {
    throw new Error('COGNITO_REDIRECT_URI is not defined in environment variables');
  }
  this.redirectUri = redirectUri;
   }

 


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
