import { EOL } from 'os';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  getWelcomeMessage, 
  getByeMessage, 
  getCurentWorkDirMessage, 
} from './helper.js'
const start = async () => {
  const rl = await getReadLine();
  await rl.write(getWelcomeMessage());
  while(true){
    let answer = await rl.question(getCurentWorkDirMessage());
    if(answer == '.exit') {
      exit(rl);
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
  await rl.write(getByeMessage());
  rl.close();
  process.exit();
}


start();