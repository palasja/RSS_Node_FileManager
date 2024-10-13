import { homedir} from 'node:os';
import { sep, resolve } from 'node:path';
import { INPUT_ERROR_MESSAGE, ACTION_ERROR_MESSAGE } from './const.js';
import { stat, readdir } from 'node:fs/promises';
let workDir = homedir();
const rootPath = process.env.homedrive;

const getWorkDir = () => {
  return workDir;
}

const up = async (argString) => {
  //Validation - empty args
  if(argString.length > 0) throw new Error(INPUT_ERROR_MESSAGE);

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

const cd = async (argString) => {
  //Validation - args exist
  if(argString.length == 0) throw new Error(INPUT_ERROR_MESSAGE);
  
  const reg = new RegExp(`^${rootPath}`);
  let test = '';

  //Execution - check path exist and that folder
  try{
    test = resolve(workDir, argString);
    const pathStat = await stat(test);
    if(!pathStat.isDirectory()) throw new Error();
  } catch(err) {
    throw new Error(ACTION_ERROR_MESSAGE);
  }
  
  //Check - same root directory
  if(reg.test(test)){
    workDir = resolve(workDir, argString);
  }
}

const ls = async (argString) => {
  //Validation - empty args
  if(argString.length > 0) throw new Error(INPUT_ERROR_MESSAGE);
  
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
  cd,
  ls
}