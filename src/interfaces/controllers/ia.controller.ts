// presentation/controllers/ai.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ExtractDataFromTextUseCase } from 'src/application/use-cases/extract-data-from-text.use-case';

@Controller('ai')
export class AiController {
  constructor(private readonly extractDataUseCase: ExtractDataFromTextUseCase) {}

  @Post('extract')
  async extract(@Body('text') text: string) {
    const data = await this.extractDataUseCase.execute(text);
    return { data };
  }
}
