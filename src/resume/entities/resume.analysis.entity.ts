import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Resume } from './resume.entity';

@Entity()
export class ResumeAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  skills: string[];

  @Column({ type: 'text' })
  experienceSummary: string;

  @Column({ type: 'jsonb' })
  strengths: string[];

  @Column({ type: 'jsonb' })
  weakness: string[];

  @Column({ type: 'jsonb' })
  missingSkills: string[];

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'jsonb' })
  suggestions: string[];

  @OneToOne(() => Resume, (r) => r.analysis, {
    onDelete: 'CASCADE',
  })
  resume: Resume;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
