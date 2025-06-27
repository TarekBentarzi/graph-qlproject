import { MistralLocalClientService } from '../mistral-client.repository';
import axios from 'axios';

jest.mock('axios');

describe('MistralLocalClientService', () => {
  let service: MistralLocalClientService;

  beforeEach(() => {
    service = new MistralLocalClientService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should extract structured data', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { response: '[{"a":1}]' } });
    const result = await service.extractStructuredDataFromText('test');
    expect(result).toEqual([{ a: 1 }]);
  });
});