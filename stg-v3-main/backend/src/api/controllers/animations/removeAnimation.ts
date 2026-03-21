import process from 'node:process';
import {S3Client, DeleteObjectCommand} from '@aws-sdk/client-s3';
import {type Request, type Response} from 'express';
import {AnimationProject} from '../../../models/index.js';

// Initialize S3 client
const client = new S3Client({forcePathStyle: true});

/**
 * Handler to remove an animation project and its associated files from S3
 */
export async function removeAnimation(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as {id: string};

  // Find the animation project by ID
  const animationProject = await AnimationProject.findById(id);
  if (!animationProject) {
    response.status(404).json({error: 'Animation project not found'});
    return;
  }

  // Delete each language file from S3
  await Promise.all(
    animationProject.languages.map(async (language) => {
      const key = `animation-${animationProject._id.toJSON()}-${language}.json`;
      const cmd = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
      });
      await client.send(cmd);
    }),
  );

  // Remove the project document from MongoDB
  await animationProject.deleteOne();

  // Respond with no content
  response.status(204).send();
}
