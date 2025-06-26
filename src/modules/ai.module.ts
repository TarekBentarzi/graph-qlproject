import { Module } from '@nestjs/common';
import { MistralLocalClientService } from '../infra/repositories/mistral-client.repository'; 

@Module({
  providers: [MistralLocalClientService],
  exports: [MistralLocalClientService],
})
export class AiModule {}