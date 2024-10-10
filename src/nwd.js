import { homedir} from 'node:os';
import { sep, resolve } from 'node:path';
import { INPUT_ERROR_MESSAGE, ACTION_ERROR_MESSAGE } from './const.js';

let workDir = homedir();
let rootPath = process.env.homedrive;
const getWorkDir = () => {
  return workDir;
}

const up = (args) => {
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

const cp = (args) => {
  //Validation - only one line
  if(args.length != 1) throw new Error(ACTION_ERROR_MESSAGE);
  const reg = new RegExp(`^${rootPath}`);
  let test = '';
  const pathLine = args[0];

  //Execution - try get absolute or relative path
  try{
    test = resolve(workDir, pathLine);
  } catch(err) {
    throw new Error(ACTION_ERROR_MESSAGE);
  }
  
  //Check - same root directory
  if(reg.test(test)){
    workDir = resolve(workDir, ...args);
  }
}

export {
  getWorkDir,
  up,
  cp
}