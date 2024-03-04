import * as fs from 'node:fs/promises';

const TEST_PATH = '../sample/example.md';
const readMarkDown =  async (path) => {
  try {
    return fs.readFile(path,'utf-8');
  }catch (err) {
    console.error('Error during reading the file',err);
  }
}

const nestedRegex = [
  /^(\s*-\s+.+(\n|$))+/gm,
  /^(#+)\s+.+(\n|$)/gm,
  /^(>\s+.+(\n|$))+/gm,
]

const validateNestedMarkdown = (markdown) => {
  for (const regex of nestedRegex) {
    if (markdown.match(regex)) return true;
  }
  return false
}

const validateTagsClosed = (markdown) => {
  const regexPattern = /\*{1,2}|_|\`|\`\`\`/g;
  const matches = markdown.match(regexPattern);
  const regex = /._./g;
  const single = markdown.match(regex);
  removeNonTags('_',single.length,matches);
  return validatePairs(matches);
}

const validatePairs = (markdownTags) => {
  const tags = ['*','**','_','`'];
  for (const tag of tags) {
    const fTags = markdownTags.filter((mtag) => mtag === tag )
    if (fTags.length % 2) return false
  }
  return true;
}

const removeNonTags = (tag, number, array) => {
  while (number) {
    let index = array.indexOf(tag);
    array.splice(index, 1);
    number--;
  }
  return array;
}

function parseMarkdownToHtml(markdownText) {
  const html = markdownText
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/(?<![a-zA-Z0-9])_(.*?)_(?![a-zA-Z0-9])/g, '<i>$1</i>')
    .replace(/_(.*?)_/g, '<i>$1</i>')
    .replace(/```\n([\s\S]*?)\n```/g, '<pre>$1</pre>')
    .replace(/`([^`]+)`/g, '<tt>$1</tt>')
    .replace(/(?:\r\n|\r|\n){2,}/g, '</p><p>')

  return '<p>' + html + '</p>';
}

const main = async () => {
  const markdown = await readMarkDown(TEST_PATH);
  if (validateNestedMarkdown(markdown)) throw new Error('Markdown should not have nested tags')
  if (!validateTagsClosed(markdown)) throw new Error('Markdown shouldn not have unclosed tags');
  parseMarkdownToHtml(markdown);
}

main();


