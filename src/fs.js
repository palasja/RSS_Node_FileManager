import { open } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { ACTION_ERROR_MESSAGE } from './const.js';
import { getFullPath } from './nwd.js';
import { resolve, basename, dirname } from 'node:path';
import { writeFile, rename, rm as remove} from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import {
  checkArgsExist,
  checkArgsStringHasTwoArg,
  checkPathIsFile,
  checkPathIsFolder,
} from './helper.js';

const cat = async (argString) => {
  checkArgsExist(argString);
  const path = getFullPath(argString);
  try{
    await checkPathIsFile(path);
    const fd = await open(path);
    const stream = fd.createReadStream();
    await pipeline(stream, process.stdout, {end: false});
  } catch(err){
    throw new Error(ACTION_ERROR_MESSAGE);
  }
}

const add = async (argString) => {
  checkArgsExist(argString);
  const path = getFullPath(argString);
  const options = {flag: 'wx'};
  try{
    await writeFile(path, '', options);
  } catch(err){
    throw new Error(ACTION_ERROR_MESSAGE);
  }
}

const rn = async (argString) => {
  checkArgsExist(argString);
  checkArgsStringHasTwoArg(argString);
  const args = argString.split(' ');
  const file = getFullPath(args[0]);
  const newFile = resolve(dirname(file), args[1]);
  try{
    await checkPathIsFile(file);
    await rename(file, newFile)
  } catch(err){
    throw new Error(ACTION_ERROR_MESSAGE);
  }
}

const cp = async (argString) => {
  checkArgsExist(argString);
  checkArgsStringHasTwoArg(argString);
  const args = argString.split(' ');
  try{
    const sourcePath = getFullPath(args[0]);
    const fdSource = await open(sourcePath);
    const destinationPath = getFullPath(args[1]);
    
    await checkPathIsFile(sourcePath);
    await checkPathIsFolder(destinationPath);

    const readable = fdSource.createReadStream();
    const writable = createWriteStream(resolve(destinationPath, basename(sourcePath)));
    
    await pipeline(readable, writable);
  } catch(err){
    throw new Error(ACTION_ERROR_MESSAGE);
  }
}

const mv = async (argString) => {
  await cp(argString);
  await rm(argString.split(' ')[0]);
}

const rm = async (argString) => {
  checkArgsExist(argString);

  try{
    const filePath = getFullPath(argString);
    await checkPathIsFile(filePath);

    await remove(getFullPath(filePath));
  } catch(err){
    throw new Error(ACTION_ERROR_MESSAGE);
  }
}

export {
  cat,
  add,
  cp,
  rn,
  rm,
  mv
}