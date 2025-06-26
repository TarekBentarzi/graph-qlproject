import { Injectable, Inject } from '@nestjs/common';
import { UploadPdfCommand } from '../commands/upload-pdf.command';
import { PdfRepository } from '../../domain/repositories/local-pdf.repository';
import { PDF_REPOSITORY } from '../../domain/repositories/pdf-repository.token';

@Injectable()
export class UploadPdfUseCase {
  constructor(
    @Inject(PDF_REPOSITORY)
    private readonly repository: PdfRepository,
  ) {}

  async execute(command: UploadPdfCommand): Promise<void> {
    await this.repository.saveFile(command);
  }
}
