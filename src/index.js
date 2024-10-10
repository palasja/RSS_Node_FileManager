import * as readline from 'node:readline/promises';
import { EOL, homedir } from 'node:os';
import { sep, resolve } from 'node:path';
import { stdin as input, stdout as output } from 'node:process';
import {
  getWelcomeMessage, 
  getByeMessage, 
  getCurentWorkDirMessage, 
} from './helper.js';
import { up, cp } from './nwd.js'

const operation = {
  up: up,
  cp: cp
}

const start = async () => {
  const rl = await getReadLine();
  await rl.write(getWelcomeMessage());
  while(true){
    const operationLine = await rl.question(getCurentWorkDirMessage());
    if(operationLine == '.exit') {
      exit(rl);
    };
    const operationArr = operationLine.split(' ');
    const currentOperationName = operationArr[0];
    const currentOperationArgsLine = operationArr.slice(1);
    try{
      const action = operation[currentOperationName];
      action(currentOperationArgsLine);
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