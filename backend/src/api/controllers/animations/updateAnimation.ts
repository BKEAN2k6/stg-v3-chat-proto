import {Buffer} from 'node:buffer';
import {gzip, constants as zlibConstants} from 'node:zlib';
import {promisify} from 'node:util';
import process from 'node:process';
import {type Request, type Response} from 'express';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import mongoose from 'mongoose';
import {AnimationProject} from '../../../models/index.js';
import {
  type UpdateAnimationParameters,
  type UpdateAnimationRequest,
} from '../../client/ApiTypes.js';

const client = new S3Client({forcePathStyle: true});
const gzipAsync = promisify(gzip);

export async function updateAnimation(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as UpdateAnimationParameters;
  const {name, isChecked, animations, assetSettings, segments, loop} =
    request.body as UpdateAnimationRequest;
  const animationProject = await AnimationProject.findById(id);
  if (!animationProject) {
    response.status(404).json({error: 'Animation project not found'});
    return;
  }

  if (name) {
    animationProject.name = name;
  }

  if (isChecked !== undefined) {
    animationProject.isChecked = isChecked;
  }

  if (animations) {
    animationProject.set(
      'animations',
      animations.map(({language}) => language),
    );
  }

  if (assetSettings) {
    animationProject.set('assetSettings', assetSettings);
  }

  if (segments) {
    animationProject.segments = segments;
  }

  if (loop !== undefined) {
    animationProject.loop = loop;
  }

  animationProject.updatedBy = new mongoose.Types.ObjectId(request.user.id);
  await animationProject.save();

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
