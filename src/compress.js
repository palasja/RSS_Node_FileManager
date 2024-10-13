import { open } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { COMPRESS_POSTFIX } from './const.js';
import { getWorkDir } from './nwd.js';
import { resolve, basename, dirname } from 'node:path';
import { writeFile, rename, rm as remove} from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import {
  checkArgsExist,
  checkArgsStringHasTwoArg,
  checkPathIsFile,
  checkPathIsFolder,
} from './helper.js';
import { getFullPath } from './nwd.js';

const compress = async (argString) => {
  checkArgsExist(argString);
  checkArgsStringHasTwoArg(argString);

  const args = argString.split(' ');
  try{
    const sourcePath = getFullPath(args[0]);
    const destinationPath = getFullPath(args[1]);
    
    await checkPathIsFile(sourcePath);
    await checkPathIsFolder(destinationPath);

    const readable = createReadStream(getFullPath(sourcePath));
    const writable = createWriteStream(resolve(destinationPath, basename(sourcePath) + COMPRESS_POSTFIX ));
    const brotli = createBrotliCompress();
    await pipeline(readable, brotli, writable);
  } catch(err){
    console.error(err);
    // throw new Error(ACTION_ERROR_MESSAGE);
  }
}
const decompress = async (argString) => {
  checkArgsExist(argString);
  checkArgsStringHasTwoArg(argString);

  const args = argString.split(' ');
  try{
    const sourcePath = getFullPath(args[0]);
    const destinationPath = getFullPath(args[1]);
    
    await checkPathIsFile(sourcePath);
    await checkPathIsFolder(destinationPath);

    const readable = createReadStream(getFullPath(sourcePath));
    const writable = createWriteStream(resolve(destinationPath, basename(sourcePath).slice(0, -COMPRESS_POSTFIX.length)));
    const brotli = createBrotliDecompress();
    await pipeline(readable, brotli, writable);
  } catch(err){
    console.error(err);
    // throw new Error(ACTION_ERROR_MESSAGE);
  }
}

export {
  compress,
  decompress
}