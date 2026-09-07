import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resume } from './entities/resume.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ResumeParserService } from './services/resume-parser.service';
import { ResumeAnalysis } from './entities/resume.analysis.entity';
import { ResumeAiService } from './services/resume-ai.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resume, ResumeAnalysis]),
    CloudinaryModule,
  ],
  controllers: [ResumeController],
  providers: [ResumeService, ResumeParserService, ResumeAiService],
  exports: [ResumeService],
})
export class ResumeModule {}
