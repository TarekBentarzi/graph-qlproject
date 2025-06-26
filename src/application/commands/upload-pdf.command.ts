export class UploadPdfCommand {
  constructor(
    public readonly originalName: string,
    public readonly buffer: Buffer,
    public readonly mimetype: string,
    public readonly size: number,
  ) {}
}