import { EOL, cpus, homedir, arch, userInfo } from 'node:os';
import { INPUT_ERROR_MESSAGE } from './const.js';
import { OS_ARG_PREFIX } from './const.js';
import { checkArgsExist} from './helper.js';
const os = async (argString) => {
  checkArgsExist(argString);
  //Validation - args start by --
  const regPrefix = new RegExp(`^${OS_ARG_PREFIX}`);
  if(!regPrefix.test(argString)) throw new Error(INPUT_ERROR_MESSAGE);

  const infoArg = argString.slice(OS_ARG_PREFIX.length);
  //Validation - arg exist in info properties
  if(!info.hasOwnProperty(infoArg)) throw new Error(INPUT_ERROR_MESSAGE);

  console.log(info[infoArg]);
}

const info = {
  EOL: JSON.stringify(EOL),
  cpus: cpus(),
  homedir: homedir(),
  username: userInfo().username,
  architecture: arch()
}

export {
  os
}