'use strict'

import fs from 'node:fs/promises';

const readFile = async (path) => {
  try {
    return fs.readFile(path,'utf-8');
  }catch (err) {
    console.error('Error during reading the file',err);
  }
}

const writeFile = async (path, data) => {
  await fs.writeFile(path,data);
}

export {readFile, writeFile};