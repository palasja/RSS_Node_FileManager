import { homedir} from 'node:os';
import { sep, resolve } from 'node:path';
import { INPUT_ERROR_MESSAGE, ACTION_ERROR_MESSAGE } from './const.js';
import { stat, readdir } from 'node:fs/promises';
import { checkArgsExist, checkArgsEmpty, checkPathIsFolder} from './helper.js';

let workDir = homedir();
const rootPath = process.env.homedrive;

const getWorkDir = () => {
  return workDir;
}

const up = async (argString) => {
  checkArgsEmpty(argString);

  try{
    let pathArr = workDir.split(sep);
    if(pathArr.length != 1) {
      workDir = pathArr.slice(0,-1).join(sep);
    }
  } catch(err) {
    throw new Error(ACTION_ERROR_MESSAGE);
  }

}

const cd = async (argString) => {
  checkArgsExist(argString);
  
  const reg = new RegExp(`^${rootPath}`);
  try{
    const fullPath = resolve(workDir, argString);
    await checkPathIsFolder(fullPath);

    if(reg.test(fullPath)){
      workDir = resolve(workDir, argString);
    } else {
      throw new Error();
    }
  } catch(err) {
    throw new Error(ACTION_ERROR_MESSAGE);
  }
}

const ls = async (argString) => {
  checkArgsEmpty(argString);
  const DIR_LINE = '|  directory  |  ';
  const FILE_LINE = '|     file    |  ';
  try{
    let dir = await readdir(workDir, {withFileTypes: true});
    dir.sort(fileDirectorySort);
    for await (const folder of dir)
        console.log(folder.isDirectory() ? DIR_LINE : FILE_LINE, folder.name);
  } catch(err){
    throw new Error(ACTION_ERROR_MESSAGE);
  }
}

const fileDirectorySort = (val1, val2) => {
  return (val1.isDirectory() == val2.isDirectory())? 0 : val1.isDirectory()? -1 : 1;
}

export {
  getWorkDir,
  up,
  cd,
  ls
}