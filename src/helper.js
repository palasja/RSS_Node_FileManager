import { EOL } from 'node:os';
import { USERNAME_ARG } from './const.js';


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

export {
  getWelcomeMessage,
  getByeMessage,
  getCurentWorkDirMessage,
}