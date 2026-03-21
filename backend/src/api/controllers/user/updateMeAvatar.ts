import crypto from 'node:crypto';
import process from 'node:process';
import {type Request, type Response} from 'express';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import {User} from '../../../models/index.js';
import {type UpdateMeAvatarResponse} from '../../client/ApiTypes.js';

const client = new S3Client({forcePathStyle: true});

export async function updateMeAvatar(
  request: Request,
  response: Response,
): Promise<void> {
  if (!request.user) {
    response.status(401).json({error: 'Unauthorized'});
    return;
  }

  const user = await User.findById(request.user.id);
  if (!user) {
    response.status(404).json({error: 'User not found'});
    return;
  }

  const fileName = `${crypto.randomBytes(16).toString('hex')}.jpg`;
  const data = request.body as Uint8Array;
  const command = new PutObjectCommand({
    Key: fileName,
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Body: data,
    ContentType: 'image/jpeg',
  });

  await client.send(command);

  user.avatar = fileName;
  await user.save();

  response.json({avatar: fileName} satisfies UpdateMeAvatarResponse);
}
