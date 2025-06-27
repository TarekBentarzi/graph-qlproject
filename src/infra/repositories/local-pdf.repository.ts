// infrastructure/local/local-pdf.repository.ts
import { Injectable } from '@nestjs/common';
import { PdfRepository } from '../../domain/repositories/local-pdf.repository';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { MistralLocalClientService } from './mistral-client.repository';
// ✅ Hack pour importer correctement PDFParser depuis un module CommonJS
const PDFParser = require('pdf2json');
import { Buffer } from 'buffer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalPdfRepository implements PdfRepository {
  private pdfs = new Map<string, { buffer: Buffer; mimetype: string; size: number }>();
  private readonly lambdaEndpointUrl: string;
  constructor(
    private readonly aiClient: MistralLocalClientService,private readonly config: ConfigService
  ) {

const lambdaUrl = this.config.get<string>('LAMBDA_ENDPOINT_URL');
if (!lambdaUrl) {
  throw new Error('LAMBDA_ENDPOINT_URL is not defined in environment variables');
}
this.lambdaEndpointUrl = lambdaUrl;
  }

  async saveFile(command: { originalName: string; buffer: Buffer; mimetype: string; size: number }): Promise<void> {
    const { originalName, buffer, mimetype, size } = command;

    console.log('📄 PDF reçu pour stockage:', originalName, mimetype, size);
    this.pdfs.set(originalName, { buffer, mimetype, size });

    try {
      // 1. Extraire le texte structuré via pdf2json
      const extractedText = await this.extractTextWithPdf2Json(buffer);

      // 2. 🧠 Appel à l'IA pour structurer les données
      const structuredData = await this.aiClient.extractStructuredDataFromText(extractedText);
      console.log('📊 Données extraites par IA:', structuredData);

      // 3. Normalisation et génération Excel
      let dataArray: any[] = [];
      if (Array.isArray(structuredData)) {
        dataArray = structuredData;
      } else if (structuredData && typeof structuredData === 'object') {
        dataArray = [structuredData];
      }

      if (dataArray.length === 0) {
        throw new Error('Aucune donnée structurée reçue de l\'IA');
      }

      const allColumns = Array.from(
        dataArray.reduce((cols, row) => {
          Object.keys(row).forEach((key) => cols.add(key));
          return cols;
        }, new Set<string>())
      ) as string[];

      const normalizedData = dataArray.map(row => {
        const normalizedRow: Record<string, any> = {};
        allColumns.forEach((col: any) => {
          normalizedRow[col] = row[col] !== undefined ? row[col] : '';
        });
        return normalizedRow;
      });

      const worksheet = XLSX.utils.json_to_sheet(normalizedData, { header: allColumns });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');

      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      const base64Excel = excelBuffer.toString('base64');
      const excelFileName = originalName.replace(/\.pdf$/i, '.xlsx');

      await axios.post(
        `${this.lambdaEndpointUrl}${excelFileName}`,
        { file: base64Excel },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-filename': excelFileName,
          },
        }
      );

      console.log('✅ Envoi réussi à Lambda');
    } catch (err) {
      console.error('❌ Erreur lors de l’envoi à Lambda:', err?.response?.data || err.message);
      throw new Error('Échec de l\'enregistrement distant');
    }
  }

  private extractTextWithPdf2Json(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();

      pdfParser.on('pdfParser_dataError', errData => {
        reject(errData.parserError);
      });

      pdfParser.on('pdfParser_dataReady', pdfData => {
        try {
          const textContent = pdfData?.Pages?.map(page => {
            return page.Texts?.map(textObj =>
              decodeURIComponent(textObj.R.map(r => r.T).join(''))
            ).join(' ');
          }).join('\n');

          resolve(textContent || '');
        } catch (e) {
          reject(e);
        }
      });

      pdfParser.parseBuffer(buffer);
    });
  }
}
