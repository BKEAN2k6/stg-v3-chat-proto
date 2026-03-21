import fs from 'node:fs';
import process from 'node:process';
import path from 'node:path';

const absPath = path.resolve(
  process.env.NODE_ENV === 'production' ? './frontend' : './../frontend',
);

const packageJson = JSON.parse(
  fs.readFileSync(path.join(absPath, 'package.json'), 'utf8'),
) as {
  version: string;
};

export default packageJson.version;
