import { EOL } from 'node:os';
import { USERNAME_ARG, INPUT_ERROR_MESSAGE, ACTION_ERROR_MESSAGE } from './const.js';
import { stat } from 'node:fs/promises';
const getWelcomeMessage = () => {
  const userName = getUserName();
  return `Welcome to the File Manager, ${userName}!` + EOL;
}
const getByeMessage = () => {
  const userName = getUserName();
  return `Thank you for using File Manager, ${userName}, goodbye!` + EOL;
}

const getCurentWorkDirMessage = (workDir) => {
  return `You are currently in ${workDir}` + EOL;
}

let userName = undefined;
const getUserName = () => {
  if(userName == undefined){
    const reg = new RegExp(USERNAME_ARG);
    const VALUE_NUMBER = 1;
    userName = process.argv.find(arg => reg.test(arg)).split('=')[VALUE_NUMBER];  
  }
  return userName;
}

const checkArgsEmpty = (argString) => {
  //Validation - argString is empty
  if(argString.length > 0) throw new Error(ACTION_ERROR_MESSAGE);
}

const checkArgsExist = (argString) => {
  //Validation - argString isn't empty
  if(argString.length == 0) throw new Error(ACTION_ERROR_MESSAGE);
}

const checkArgsStringHasTwoArg = (argString) => {
    //Validation - argString has 2 parameters
    const args = argString.split(' ');
    if(args.length != 2) throw new Error(ACTION_ERROR_MESSAGE);
}

const checkPathIsFile =  async (path) => {
  //Validation - second arg is file
  const pathStat = await stat(path);
  if(!pathStat.isFile()) throw new Error();
}

const checkPathIsFolder =  async (path) => {
      //Validation - second arg is folder
      const destinationStat = await stat(path);
      if(! destinationStat.isDirectory()) throw new Error();
}

export {
  getWelcomeMessage,
  getByeMessage,
  getCurentWorkDirMessage,
  checkArgsExist,
  checkArgsStringHasTwoArg,
  checkPathIsFile,
  checkPathIsFolder,
  checkArgsEmpty,
}
