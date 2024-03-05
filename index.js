'use strict';

import path from "node:path";
import {parse} from "./convertor.js";
import {readFile, writeFile} from "./fileSystem.js";

const convent = async (filePath) => {
  const currentModuleUrl = new URL(import.meta.url);
  const currentDir = path.dirname(currentModuleUrl.pathname);
  const parentDir = path.join(currentDir, '..');
  const absolutePath = path.join(parentDir, filePath[2]);

  const data = await readFile(absolutePath);
  const html = parse(data);

  if (filePath.find(item => item === '--out')){
    const outPath = path.join(parentDir,filePath[4])
    await writeFile(outPath, html)
  }else {
    console.log(html)
  }
};

convent(process.argv)
