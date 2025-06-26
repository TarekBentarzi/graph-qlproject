import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadPdfUseCase } from '../../application/use-cases/uploadPdf.use-case';
import { UploadPdfCommand } from '../../application/commands/upload-pdf.command';

@Controller('pdf')
export class PdfController {
  constructor(private readonly uploadPdfUseCase: UploadPdfUseCase) {} // 👈 injection correcte ici

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPDF(@UploadedFile() file: Express.Multer.File) {
    const command = new UploadPdfCommand(
      file.originalname,
      file.buffer,
      file.mimetype,
      file.size
    );
    await this.uploadPdfUseCase.execute(command);
    return { message: 'Fichier reçu et traité.' };
  }
}
