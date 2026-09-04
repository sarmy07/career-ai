import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { validation } from './config/validation.schema';
import { UsersModule } from './users/users.module';
import { ResumeModule } from './resume/resume.module';
import authConfig from './auth/config/auth.config';

@Module({
  imports: [
    CloudinaryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validation,
      load: [authConfig],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UsersModule,
    ResumeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
