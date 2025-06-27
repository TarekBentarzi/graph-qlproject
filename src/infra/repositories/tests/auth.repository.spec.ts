import { AuthService } from '../auth.repository';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let config: ConfigService;

  beforeEach(() => {
    config = {
      get: jest.fn((key: string) => {
        switch (key) {
          case 'COGNITO_CLIENT_ID': return 'clientId';
          case 'COGNITO_CLIENT_SECRET': return 'clientSecret';
          case 'COGNITO_DOMAIN': return 'https://domain';
          case 'COGNITO_REDIRECT_URI': return 'http://localhost/callback';
        }
      }),
    } as any;
    service = new AuthService(config);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});