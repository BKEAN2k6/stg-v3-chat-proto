import crypto from 'node:crypto';
import process from 'node:process';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import sharp from 'sharp';

const client = new S3Client({forcePathStyle: true});

const uploadImage = async (data: Uint8Array) => {
  const fileName = `${crypto.randomBytes(16).toString('hex')}.jpg`;
  const command = new PutObjectCommand({
    Key: fileName,
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Body: data,
    ContentType: 'image/jpeg',
  });

  await client.send(command);

  return fileName;
};

type ImageVersions = {
  aspectRatio: number;
  thumbnailImageUrl: string;
  resizedImageUrl: string;
  originalImageUrl: string;
};

export async function uploadImageVersions(
  data: Uint8Array,
): Promise<ImageVersions> {
  const thumbnailImage = await sharp(data)
    .flatten({background: '#ffffff'})
    .resize(100, 100)
    .rotate()
    .jpeg({mozjpeg: true})
    .toBuffer();
  const resizedImage = await sharp(data)
    .flatten({background: '#ffffff'})
    .resize(1600, 1600, {
      fit: 'inside',
    })
    .rotate()
    .jpeg({mozjpeg: true})
    .toBuffer();

  const originalImageJpeg = sharp(data)
    .flatten({background: '#ffffff'})
    .rotate()
    .jpeg({mozjpeg: true});
  const {width, height, orientation} = await originalImageJpeg.metadata();
  const isRotated = orientation && orientation > 4;

  const aspectRatio =
    width && height ? (isRotated ? height / width : width / height) : 3 / 2;
  const originalImage = await originalImageJpeg.toBuffer();

  const images = await Promise.all([
    uploadImage(thumbnailImage),
    uploadImage(resizedImage),
    uploadImage(originalImage),
  ]);

  return {
    aspectRatio,
    thumbnailImageUrl: images[0],
    resizedImageUrl: images[1],
    originalImageUrl: images[2],
  };
}
