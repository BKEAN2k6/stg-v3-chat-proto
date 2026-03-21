import fs from 'node:fs';
import path from 'node:path';
import {Readable} from 'node:stream';
import process from 'node:process';
import archiver from 'archiver';
import {type Request, type Response} from 'express';
import {Article, ArticleCategory} from '../../../models';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://stg-backend-production.s3.eu-north-1.amazonaws.com/'
    : 'http://localhost:5173/stg-backend-development/';

async function downloadFile(url: string, outputPath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok || response.status !== 200) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  const fileStream = fs.createWriteStream(outputPath);
  await new Promise((resolve, reject) => {
    if (response.body === null) {
      reject(new Error('Response body is not readable'));
      return;
    }

    Readable.fromWeb(response.body as any).pipe(fileStream); // eslint-disable-line @typescript-eslint/no-unsafe-argument
    fileStream.on('error', reject);
    fileStream.on('finish', resolve);
  });
}

export async function createArticesBackup(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const errors = [];
    const directoryName = path.resolve();
    const articles = await Article.find();
    const articleCategories = await ArticleCategory.find();

    // Create files directory if it doesn't exist
    const filesDirectory = path.join(directoryName, 'files');
    if (!fs.existsSync(filesDirectory)) {
      fs.mkdirSync(filesDirectory);
    }

    const archive = archiver('zip', {zlib: {level: 9}});
    const outputPath = path.join(directoryName, 'articles.zip');
    const output = fs.createWriteStream(outputPath);

    archive.pipe(output);

    archive.append(JSON.stringify(articles), {name: 'articles.json'});
    archive.append(JSON.stringify(articleCategories), {
      name: 'articleCategories.json',
    });

    const imageRegex = /\[.*?]\((.*?\..*?)\)/g;

    for (const article of articles) {
      for (const translation of article.translations) {
        const content = translation.content.join('\n');
        const matches = [...content.matchAll(imageRegex)];

        for (const match of matches) {
          const filePath = match[1]?.split('#')[0];
          const articleId = article._id.toHexString();
          if (!filePath) {
            errors.push(
              `Failed to parse file link: ${match[0]}. Article id: ${articleId}`,
            );

            continue;
          }

          if (filePath.startsWith('http')) {
            continue;
          }

          const fullUrl = `${BASE_URL}${filePath}`;
          const localFilePath = path.join(
            directoryName,
            'files',
            path.basename(filePath),
          );

          try {
            await downloadFile(fullUrl, localFilePath); // eslint-disable-line no-await-in-loop
            archive.file(localFilePath, {
              name: `files/${path.basename(decodeURI(filePath))}`,
            });
          } catch {
            errors.push(
              `Failed to download file: ${fullUrl}. Article id: ${articleId}`,
            );
          }
        }
      }
    }

    if (errors.length > 0) {
      archive.append(errors.join('\n'), {name: 'errors.txt'});
    }

    await archive.finalize();

    const fileName =
      errors.length > 0 ? 'articles_with_errors.zip' : 'articles.zip';

    response.setHeader('Content-Type', 'application/zip');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileName}`,
    );
    const stream = fs.createReadStream(outputPath).pipe(response);

    stream.on('finish', () => {
      const files = fs.readdirSync(filesDirectory);
      for (const file of files) {
        fs.unlinkSync(path.join(filesDirectory, file));
      }

      fs.rmdirSync(filesDirectory);
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    request.logger.log('Error creating article zip:', error);
    response.status(500).send('Error creating zip file');
  }
}
