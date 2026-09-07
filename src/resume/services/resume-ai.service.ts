import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class ResumeAiService {
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async analyzeResume(extractedText: string) {
    const response = await this.openai.responses.create({
      model: 'gpt-5.5',

      instructions: `
      You are an expert resume analyst.

      Analyze the resume provided by the user.

      Return a structured JSON response containing:
      - skills
      - experienceSummary
      - strengths
      - weaknesses
      - missingSkills
      - score
      - suggestions

      Base your analysis ONLY on information present in the resume.
      Do not invent experience, skills, education, or achievements. 
    `,

      input: extractedText,

      text: {
        format: {
          type: 'json_schema',
          name: 'resume_analysis',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              skills: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },

              experienceSummary: {
                type: 'string',
              },

              strengths: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },

              weaknesses: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },

              missingSkills: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },

              score: {
                type: 'integer',
                minimum: 0,
                maximum: 100,
              },

              suggestions: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },

            required: [
              'skills',
              'experienceSummary',
              'strengths',
              'weaknesses',
              'missingSkills',
              'score',
              'suggestions',
            ],

            additionalProperties: false,
          },
        },
      },
    });

    return JSON.parse(response.output_text);
  }

  //   async analyzeResume(extractedText: string) {
  //     const response = await this.openai.responses.create({
  //       model: 'gpt-5.5',

  //       instructions: `
  //         You are an expert resume analyst.

  //         Analyze the resume provided by the user.

  //     Return a structured JSON response containing:
  //       - skills
  //       - experienceSummary
  //       - strengths
  //       - weaknesses
  //       - missingSkills
  //       - score
  //       - suggestions

  //         Base your analysis only on information present in the resume.
  //         Do not invent experience, skills, education, or achievements.
  //       `,

  //       input: extractedText,

  //       text: {
  //         format: {
  //           type: 'json_object',
  //         },
  //       },
  //     });

  //     return JSON.parse(response.output_text);
  //   }
}
