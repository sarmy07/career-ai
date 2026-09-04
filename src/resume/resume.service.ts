import { Injectable } from '@nestjs/common';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from './entities/resume.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UploadResumeDto } from './dto/upload.resume.dto';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume)
    private readonly resumeRepo: Repository<Resume>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    dto: UploadResumeDto,
    file: Express.Multer.File,
    userId: string,
  ) {
    const uploadedFile = await this.cloudinaryService.uploadFile(
      file,
      'blog-posts',
    );

    const resume = this.resumeRepo.create({
      title: dto.title,
      filename: file.originalname,
      fileUrl: uploadedFile.secure_url,
      filePublicId: uploadedFile.public_id,

      user: { id: userId },
    });
    return await this.resumeRepo.save(resume);
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
