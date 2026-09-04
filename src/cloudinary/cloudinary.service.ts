/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadStream } from 'cloudinary';
import { error } from 'console';
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = 'blog-posts',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const UploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder,
          public_id: `${Date.now()}-${file.originalname.replace(
            /\.[^/.]+$/,
            '',
          )}`,
        },
        (error, result) => {
          if (error) return reject(error);

          if (!result) return reject(new Error('upload failed'));
          resolve(result);
        },
      );
      UploadStream.end(file.buffer);
    });
  }

  async uploadFiles(files: Express.Multer.File[]) {
    return Promise.all(files.map((file) => this.uploadFile(file)));
  }

  async deleteFIle(publicId: string) {
    return cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw',
    });
  }
}
