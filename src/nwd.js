import { homedir, EOL} from 'node:os';
import { sep, resolve } from 'node:path';
import { INPUT_ERROR_MESSAGE, ACTION_ERROR_MESSAGE } from './const.js';
import { stat, readdir } from 'node:fs/promises';
import { stdin, stdout } from 'node:process';
import { Readable } from 'node:stream';
let workDir = homedir();
const rootPath = process.env.homedrive;

const getWorkDir = () => {
  return workDir;
}

const up = async (args) => {
  //Validation - empty args
  if(args.length > 0) throw new Error(INPUT_ERROR_MESSAGE);

  //Execution
  try{
    let pathArr = workDir.split(sep);
    if(pathArr.length != 1) {
      workDir = pathArr.slice(0,-1).join(sep);
    }
  } catch(err) {
    throw new Error(ACTION_ERROR_MESSAGE);
  }

}

const cp = async (args) => {
  //Validation - args exist
  if(args.length == 0) throw new Error(INPUT_ERROR_MESSAGE);
  
  const reg = new RegExp(`^${rootPath}`);
  let test = '';

  //Execution - check path exist and that folder
  try{
    test = resolve(workDir, args);
    const pathStat = await stat(test);
    if(!pathStat.isDirectory()) throw new Error();
  } catch(err) {
    throw new Error(ACTION_ERROR_MESSAGE);
  }
  
  //Check - same root directory
  if(reg.test(test)){
    workDir = resolve(workDir, args);
  }
}

const ls = async (args) => {
  //Validation - empty args
  if(args.length > 0) throw new Error(INPUT_ERROR_MESSAGE);
  
  //Execution
  try{
    let dir = await readdir(workDir, {withFileTypes: true});
    dir.sort(fileDirectorySort);
    for await (const folder of dir)
        console.log(folder.isDirectory() ? '|  directory  |  ' : '|     file    |  ', folder.name);
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
  cp,
  ls
}