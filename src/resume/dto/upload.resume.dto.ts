import { IsNotEmpty, IsString } from 'class-validator';

export class UploadResumeDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
