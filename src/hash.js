import { createHash } from 'node:crypto';
import { CRYPTO_ENCODE } from './const.js';
import { ACTION_ERROR_MESSAGE } from './const.js';
import { resolve } from 'node:path';
import { getWorkDir } from './nwd.js'
import { open } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';
import {  EOL} from 'node:os';
import { checkArgsExist} from './helper.js';

const hash = async (argString) => {
  checkArgsExist(argString);

  const OUTPUT_ENCODE = 'hex';
  const filePath = resolve(getWorkDir(), argString);
  try{
    const fd = await open(filePath);
    const input = fd.createReadStream();
    const hash = createHash(CRYPTO_ENCODE).setEncoding(OUTPUT_ENCODE);
    const newLineTransform = new Transform({
      transform(chunk, _encoding, callback) {
        callback(null, chunk.toString() + EOL);
      },
    });

    await pipeline(
      input,
      hash,
      newLineTransform,
      process.stdout, 
      {end: false}
    );
  } catch(err){
    throw new Error(ACTION_ERROR_MESSAGE);
  }
}

export {
  hash
}