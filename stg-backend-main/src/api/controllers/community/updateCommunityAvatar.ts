import crypto from 'node:crypto';
import process from 'node:process';
import {type Request, type Response} from 'express';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import {Community} from '../../../models';
import {
  type UpdateCommunityAvatarParameters,
  type UpdateCommunityAvatarResponse,
} from '../../client/ApiTypes';

const client = new S3Client({forcePathStyle: true});

export async function updateCommunityAvatar(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as UpdateCommunityAvatarParameters;

  const community = await Community.findById(id);
  if (!community) {
    response.status(404).json({error: 'Community not found'});
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

  community.avatar = fileName;
  await community.save();

  response.json({avatar: fileName} satisfies UpdateCommunityAvatarResponse);
}
