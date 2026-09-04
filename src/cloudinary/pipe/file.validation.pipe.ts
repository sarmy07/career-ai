import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FIleValidationPipe implements PipeTransform {
  private readonly allowedMimeTypes = ['application/pdf'];

  private readonly maxSizeBytes = 5 * 1024 * 1024;

  transform(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('resume file is required');

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('only pdf files are allowed');
    }

    if (file.size > this.maxSizeBytes) {
      throw new BadRequestException('resume must be less than 5mb');
    }
    return file;
  }
}
