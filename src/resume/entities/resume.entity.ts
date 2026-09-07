import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ResumeStatus } from '../enums/resume.status.enum';
import { User } from 'src/users/entities/user.entity';
import { ResumeAnalysis } from './resume.analysis.entity';

@Entity()
export class Resume {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  filename: string;

  @Column()
  fileUrl: string;

  @Column()
  filePublicId: string;

  @Column({
    type: 'enum',
    enum: ResumeStatus,
    default: ResumeStatus.UPLOADED,
  })
  status: ResumeStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  extractedText: string | null;

  @ManyToOne(() => User, (u) => u.resumes, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToOne(() => ResumeAnalysis, (ra) => ra.resume)
  analysis: ResumeAnalysis;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
