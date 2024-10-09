import { homedir} from 'os';
import { sep } from 'node:path';

let workDir = homedir();

const getWorkDir = () => {
  return workDir;
}

const up = () => {
  let pathArr = workDir.split(sep);
  if(pathArr.length != 1) {
    workDir = pathArr.slice(0,-1).join(sep);
  }
}

export {
  getWorkDir,
  up
}