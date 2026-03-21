import {Buffer} from 'node:buffer';
import {gzip, constants as zlibConstants} from 'node:zlib';
import {promisify} from 'node:util';
import process from 'node:process';
import {type Request, type Response} from 'express';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import mongoose from 'mongoose';
import {AnimationProject} from '../../../models/index.js';
import {type CreateAnimationRequest} from '../../client/ApiTypes.js';

const client = new S3Client({forcePathStyle: true});
const gzipAsync = promisify(gzip);

export async function createAnimation(
  request: Request,
  response: Response,
): Promise<void> {
  const {name, isChecked, animations, assetSettings, segments} =
    request.body as CreateAnimationRequest;

  const animationProject = await AnimationProject.create({
    name,
    isChecked,
    updatedBy: new mongoose.Types.ObjectId(request.user.id),
    createdBy: new mongoose.Types.ObjectId(request.user.id),
    languages: animations.map(({language}) => language),
    assetSettings,
    segments,
  });

  await Promise.all(
    animations.map(async ({language, data}) => {
      const gzipBuffer = await gzipAsync(
        Buffer.from(JSON.stringify(data), 'utf8'),
        {
          level: zlibConstants.Z_BEST_COMPRESSION,
        },
      );

      const key = `animation-${animationProject._id.toJSON()}-${language}.json`;

      const cmd = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: gzipBuffer,
        ContentType: 'application/json',
        ContentEncoding: 'gzip',
        CacheControl: 'max-age=0, must-revalidate',
      });
      await client.send(cmd);
    }),
  );

  response.json(animationProject);
}
