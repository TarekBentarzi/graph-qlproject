import { UploadPdfCommand } from '../../application/commands/upload-pdf.command';

export interface PdfRepository {
  saveFile(command: UploadPdfCommand): Promise<void>;
}
