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
  let format = '';
  if (filePath.find((item) => item === '--format')) {
    format = formats[filePath[6]] ? formats[filePath[6]] : formats.html;
  }
  const parser = new Parser(format);
  const data = await readFile(absolutePath);
  const html = parser.parse(data);

  if (filePath.find(item => item === '--out')){
    const outPath = path.join(parentDir,filePath[4])
    await writeFile(outPath, html)
  }else {
    console.log(html)
  }
};

convent(process.argv)
