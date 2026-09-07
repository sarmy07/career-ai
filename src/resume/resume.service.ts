import { Injectable } from '@nestjs/common';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from './entities/resume.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UploadResumeDto } from './dto/upload.resume.dto';
import { ResumeParserService } from './services/resume-parser.service';
import { ResumeAiService } from './services/resume-ai.service';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume)
    private readonly resumeRepo: Repository<Resume>,

    private readonly cloudinaryService: CloudinaryService,
    private readonly resumeParserService: ResumeParserService,
    private readonly resumeAiService: ResumeAiService,
  ) {}

  async create(
    dto: UploadResumeDto,
    file: Express.Multer.File,
    userId: string,
  ) {
    // upload pdf to cloudinary
    const uploadedFile = await this.cloudinaryService.uploadFile(
      file,
      'blog-posts',
    );
    // extract text from pdf
    const extractedText = await this.resumeParserService.extractText(
      file.buffer,
    );

    // create resume record
    const resume = this.resumeRepo.create({
      title: dto.title,
      filename: file.originalname,
      fileUrl: uploadedFile.secure_url,
      filePublicId: uploadedFile.public_id,
      extractedText,
      user: { id: userId },
    });
    return await this.resumeRepo.save(resume);
  }

  async test() {
    const text = `
      Software engineer with experience building backend applications
    using NestJS, TypeScript, PostgreSQL and Redis.
    `;

    return this.resumeAiService.analyzeResume(text);
  }

  findAll() {
    return `This action returns all resume`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resume`;
  }

  update(id: number, updateResumeDto: UpdateResumeDto) {
    return `This action updates a #${id} resume`;
  }

  remove(id: number) {
    return `This action removes a #${id} resume`;
  }
}
