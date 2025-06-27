import { PdfRepositoryImpl } from '../pdf.repository.impl';
import { UploadPdfCommand } from '../../../application/commands/upload-pdf.command';
import * as fs from 'fs';

jest.mock('fs');

describe('PdfRepositoryImpl', () => {
  let repo: PdfRepositoryImpl;

  beforeEach(() => {
    repo = new PdfRepositoryImpl();
  });

  it('should save file', () => {
    const command = new UploadPdfCommand('test.pdf', Buffer.from('data'), 'application/pdf', 4);
    repo.saveFile(command);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });
});