import {Buffer} from 'node:buffer';
import process from 'node:process';
import {type Request, type Response} from 'express';
import {ElevenLabsClient} from '@elevenlabs/elevenlabs-js';
import {type LanguageCode} from '../../client/ApiTypes.js';

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY ?? '',
});

export async function createVoiceover(
  request: Request,
  response: Response,
): Promise<void> {
  const {text} = request.body as {
    text: string;
    language: LanguageCode;
  };

  const audio = await client.textToSpeech.convert('onwK4e9ZLuTAKqWW03F9', {
    text,
    outputFormat: 'mp3_44100_128',
    voiceSettings: {
      stability: 0.48,
      similarityBoost: 0.56,
      style: 0.16,
      useSpeakerBoost: true,
      speed: 0.93,
    },
  });

  const chunks: Uint8Array[] = [];
  for await (const chunk of audio) {
    const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    chunks.push(bufferChunk);
  }

  const audioBuffer = Buffer.concat(chunks);
  response.setHeader('Content-Type', 'audio/mp3');
  response.send(Buffer.from(audioBuffer));
}
