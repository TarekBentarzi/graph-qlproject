import { LocalPdfRepository } from '../local-pdf.repository';
import { MistralLocalClientService } from '../mistral-client.repository';
import { ConfigService } from '@nestjs/config';

describe('LocalPdfRepository', () => {
  let repo: LocalPdfRepository;
  let aiClient: MistralLocalClientService;
  let config: ConfigService;

  beforeEach(() => {
    aiClient = { extractStructuredDataFromText: jest.fn().mockResolvedValue([]) } as any;
    config = { get: jest.fn().mockReturnValue('http://lambda') } as any;
    repo = new LocalPdfRepository(aiClient, config);
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  it('should throw if LAMBDA_ENDPOINT_URL is missing', () => {
    expect(() => new LocalPdfRepository(aiClient, { get: jest.fn().mockReturnValue(undefined) } as any)).toThrow();
  });
});