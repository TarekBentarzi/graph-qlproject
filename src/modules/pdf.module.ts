import { Module } from '@nestjs/common';
import { PdfController } from '../interfaces/controllers/pdfController';
import { UploadPdfUseCase } from '../application/use-cases/uploadPdf.use-case';
import { PDF_REPOSITORY } from '../domain/repositories/pdf-repository.token'
import { LocalPdfRepository } from '../infra/repositories/local-pdf.repository';
import { AiModule } from './ai.module';
@Module({
  imports: [AiModule],
  controllers: [PdfController],
  providers: [
    UploadPdfUseCase,
    {
      provide: PDF_REPOSITORY, 
      useClass: LocalPdfRepository,
    },
  ],
  exports: [UploadPdfUseCase],
})
export class PdfModule {}
