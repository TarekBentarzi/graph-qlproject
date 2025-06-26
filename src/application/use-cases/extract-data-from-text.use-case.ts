import { Injectable } from '@nestjs/common';
import { AiClientInterface } from 'src/domain/repositories/ai-client.interface';

@Injectable()
export class ExtractDataFromTextUseCase {
  constructor(private readonly aiClient: AiClientInterface) {}

  async execute(text: string): Promise<any[]> {
    return this.aiClient.extractStructuredDataFromText(text);
  }
}