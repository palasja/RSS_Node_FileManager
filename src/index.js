import { createInterface } from 'node:readline/promises';
import { EOL } from 'node:os';
import { getWorkDir } from './nwd.js';
import { stdin as input, stdout as output } from 'node:process';
import {
  getWelcomeMessage, 
  getByeMessage, 
  getCurentWorkDirMessage, 
} from './helper.js';
import { INPUT_ERROR_MESSAGE } from './const.js';
import { up, cd, ls } from './nwd.js';
import { os } from './os.js';
import { hash } from './hash.js';
import { cat, add, rn, cp, rm, mv } from './fs.js';
import { compress, decompress} from './compress.js'
const operation = {
  up: up,
  cd: cd,
  ls: ls,
  os: os,
  hash: hash,
  cat: cat,
  add: add,
  cp: cp,
  rn: rn,
  rm: rm,
  mv: mv,
  compress: compress,
  decompress: decompress
}

const start = async () => {
  const rl = getReadLine();
  while(true){
    const workDir = getWorkDir();
    const workDirMessage = getCurentWorkDirMessage(workDir);
    const operationLine = await rl.question(workDirMessage);
    if(operationLine == '.exit') {
      exit(rl);
      process.exit();
    };
    const delimiterCharIndex = operationLine.indexOf(' ');
    const currentOperationName = delimiterCharIndex == -1 ? operationLine : operationLine.slice(0, delimiterCharIndex);
    const currentOperationArgsLine = delimiterCharIndex == -1 ? '' : operationLine.slice(delimiterCharIndex + 1);
    try{
      const action = operation[currentOperationName];
      if(action == undefined)  throw new Error(INPUT_ERROR_MESSAGE);
      await action(currentOperationArgsLine);
    } catch(err) {
      rl.write(err.message + EOL);
    }
  }
}

const getReadLine = () => {
  const readLine = createInterface({ input, output });

  readLine.on('SIGINT', () => {
    exit(readLine);
    process.exit();
  }); 
  readLine.write(getWelcomeMessage());
  return readLine;
}

const exit = async (rl) => {
  await rl.write(getByeMessage());
  rl.close();
}


start();