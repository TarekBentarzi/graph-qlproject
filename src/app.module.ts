import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth.module';
import { PdfController } from './interfaces/controllers/pdfController';
import { PdfModule } from './modules/pdf.module';
import { AiModule } from './modules/ai.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ ConfigModule.forRoot({
      isGlobal: true, 
    }),AuthModule,PdfModule, AiModule],
  controllers: [AppController,PdfController],
  providers: [AppService],
})
export class AppModule {}
