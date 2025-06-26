// application/application.module.ts
import { Module } from '@nestjs/common';
import { ExtractDataFromTextUseCase } from '../application/use-cases/extract-data-from-text.use-case';
import { MistralLocalClientService } from 'src/infra/repositories/mistral-client.repository';

@Module({
  providers: [
    ExtractDataFromTextUseCase,
    {
      provide: 'AiClientInterface',
      useClass: MistralLocalClientService,
    },
  ],
  exports: [ExtractDataFromTextUseCase],
})
export class ApplicationModule {}
