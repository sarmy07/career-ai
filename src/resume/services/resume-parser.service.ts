import { Injectable } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';

@Injectable()
export class ResumeParserService {
  async extractText(filebuffer: Buffer): Promise<string> {
    const parser = new PDFParse({
      data: filebuffer,
    });

    const result = await parser.getText();
    await parser.destroy();

    return result.text.trim();
  }
}
