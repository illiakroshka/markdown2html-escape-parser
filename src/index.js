'use strict';

import path from "node:path";
import {readFile, writeFile} from "./fileSystem.js";
import { Parser } from './parser.js';
import {htmlFormat} from "./formats/htmlFormat.js";
import {escapeFormat} from "./formats/escapeFormat.js";

const formats = {
  html: htmlFormat,
  escape: escapeFormat,
}

const convent = async (filePath) => {
  const currentModuleUrl = new URL(import.meta.url);
  const currentDir = path.dirname(currentModuleUrl.pathname);
  const parentDir = path.join(currentDir, '..');
  const absolutePath = path.join(parentDir, filePath[2]);
  let format = formats['escape'];
  let outPath = '';
  if (filePath.find(item => item === '--out')) {
    outPath = path.join(parentDir,filePath[4])
    format = formats['html'];
  }

  if (filePath.find((item) => item === '--format')) {
    format = formats[filePath[6]] ? formats[filePath[6]] : formats.html;
  }
  const parser = new Parser(format);
  const data = await readFile(absolutePath);
  const parsedData = parser.parse(data);

  if(outPath){
    await writeFile(outPath, parsedData)
  }else {
    console.log(parsedData)
  }
};

convent(process.argv)
