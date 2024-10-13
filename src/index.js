import * as readline from 'node:readline/promises';
import { EOL, homedir } from 'node:os';
import { sep, resolve } from 'node:path';
import { stat, opendir } from 'node:fs/promises';
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
  mv: mv
}

const start = async () => {
  const rl = await getReadLine();
  await rl.write(getWelcomeMessage());
  while(true){
    const workDir = getWorkDir();
    const workDirMessage = getCurentWorkDirMessage(workDir);
    const operationLine = await rl.question(workDirMessage);
    if(operationLine == '.exit') {
      exit(rl);
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

const getReadLine = async () => {
  const readLine = await readline.createInterface({ input, output });

  readLine.on('SIGINT', () => {
    exit(readLine);
  }); 
  
  return readLine;
}

const exit = async (rl) => {
  rl.close();
  await rl.write(getByeMessage());
  
  process.exit();
}


start();