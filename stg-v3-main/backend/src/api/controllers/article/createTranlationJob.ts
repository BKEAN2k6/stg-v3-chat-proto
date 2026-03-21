import process from 'node:process';
import mongoose from 'mongoose';
import {type Request, type Response} from 'express';
import OpenAI from 'openai';
import {
  type CreateTranlationJobRequest,
  type CreateTranlationJobResponse,
} from '../../client/ApiTypes.js';
import {TranslationJob} from '../../../models/index.js';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: process.env.NODE_ENV === 'test',
});

export async function createTranlationJob(
  request: Request,
  response: Response,
): Promise<void> {
  const {source, targetLanguage} = request.body as CreateTranlationJobRequest;

  const prompt = `Translate the content of this JSON document into the ${targetLanguage} language. Do not modify any text between "---", any URLs, or other non-readable elements. Only translate the readable text. Do not change word capitalization. The response should be a plain JSON object that can be directly parsed, with no comments, code blocks, or additional text before or after the JSON object: ${JSON.stringify(source)}`;

  const translationJob = await TranslationJob.create({
    createdBy: new mongoose.Types.ObjectId(request.user.id),
    prompt,
    source,
    targetLanguage,
  });

  response.json(translationJob.toJSON() satisfies CreateTranlationJobResponse);

  const chatCompletion = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  translationJob.rawResult = chatCompletion.choices[0].message.content ?? '';

  try {
    translationJob.result = {
      ...(JSON.parse(translationJob.rawResult) as {
        title: string;
        description: string;
        content: string[];
      }),
      language: targetLanguage,
    };
  } catch (error) {
    translationJob.errorMessage = (error as {message: string}).message;
  }

  translationJob.isFinished = true;

  await translationJob.save();
}
