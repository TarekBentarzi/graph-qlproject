import { Injectable } from '@nestjs/common';
import { PdfRepository } from '../../domain/repositories/local-pdf.repository';
import { UploadPdfCommand } from '../../application/commands/upload-pdf.command';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfRepositoryImpl implements PdfRepository {
  async saveFile(command: UploadPdfCommand): Promise<void> {
    const filePath = path.join(__dirname, '..', '..', '..', 'uploads', command.originalName);

    // Assurez-vous que le dossier uploads existe
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.writeFileSync(filePath, command.buffer);
    console.log(`Fichier enregistré à ${filePath}`);
  }
}
