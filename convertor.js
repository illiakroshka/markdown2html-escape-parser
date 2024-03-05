import fs from 'node:fs/promises';

const nestedRegex = [
  /^(\s*-\s+.+(\n|$))+/gm,
  /^(#+)\s+.+(\n|$)/gm,
  /^(>\s+.+(\n|$))+/gm,
]

const preformattedTextMap = new Map();

const validateNestedMarkdown = (markdown) => {
  for (const regex of nestedRegex) {
    if (markdown.match(regex)) throw new Error('Markdown should not have nested tags');
  }
  return false
}

const validateTags = (markdown) => {
  const markdownTags = getMarkdownTags(markdown);
  hasNestedAndPairedTags(markdownTags);
}

const getMarkdownTags = (markdown) => {
  const markdownTagsRegex = /\*{1,2}|_|\`|\`\`\`/g;
  const snakeCaseRegex = /._./g;
  
  const snakeCases = markdown.match(snakeCaseRegex)
  const validatedSnakeCases = validateSnakeCase(snakeCases);
  
  let cleanMarkdown = removeSnakeCases(markdown, validatedSnakeCases);
  cleanMarkdown = removeEmptyUnderscores(cleanMarkdown);
  
  return cleanMarkdown.match(markdownTagsRegex);
}

const hasNestedAndPairedTags = (tags) => {
  if (tags.length % 2) throw new Error('Markdown shouldn not have unclosed tags')
  for (let i = 0; i < tags.length; i+=2) {
    if (tags[i] !== tags[i+1]) {
      throw new Error('Markdown has nested tags');
    }
  }
}

const validateSnakeCase = (arr) => {
  const sorted = [];
  for (const element of arr) {
    if (element[0] === '`' && element[2] === '`') sorted.push(element);
    if (element[0] === '*' && element[2] === '*') sorted.push(element);
    if (element[0] !== '`' && element[0] !== '*' && element[2] !== '`' && element[2] !== '*') sorted.push(element);
  }
  return sorted;
}

const removeSnakeCases = (markdown, arr) => {
  for (const markdownElement of arr) {
    if (markdownElement[0] === '*' && markdownElement[2] === '*') {
      markdown = markdown.replace(markdownElement,'* *');
    }
    else if (markdownElement[0] === '`' && markdownElement[2] === '`') {
      markdown = markdown.replace(markdownElement,'` `');
    } else {
      markdown = markdown.replace(markdownElement, '');
    }
  }
  return markdown;
}

const removeEmptyUnderscores = (markdown) => {
  return markdown.replace(/(?<=^|\s)_+(?=\s|$)/g,'');
}

function parseMarkdownToHtml(markdownText) {
  const html = markdownText
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/(?<![a-zA-Z0-9])_(.*?)_(?![a-zA-Z0-9])/g, '<i>$1</i>')
    .replace(/_(.*?)_/g, '<i>$1</i>')
    .replace(/`([^`]+)`/g, '<tt>$1</tt>')
    .replace(/(?:\r\n|\r|\n){2,}/g, '</p><p>')

  const preformatted = returnPreformatted(html);
  preformatted.replace(/```\n([\s\S]*?)\n```/g, '<pre>$1</pre>');

  return '<p>' + preformatted + '</p>';
}

function* preformattedHashGenerator () {
  let index = 0;
  while (true){
    yield Symbol(index);
    index++;
  }
}

const removePreformatted = (markdown) => {
  const hashGenerator = preformattedHashGenerator();
  const preformattedRegex = /```\n([\s\S]*?)\n```/g
  const preformattedText = markdown.match(preformattedRegex);
  for (const text of preformattedText) {
    let hash = hashGenerator.next();
    preformattedTextMap.set(hash, text);
    markdown = markdown.replace(text, hash);
  }
  return markdown;
}

const returnPreformatted = (markdown) => {
  for (const [key, value] of preformattedTextMap) {
    markdown = markdown.replace(key,value);
  }
  return markdown;
}

const parse = (markdown) => {
  const formattedText = removePreformatted(markdown);
  validateNestedMarkdown(formattedText)
  validateTags(formattedText);
  return parseMarkdownToHtml(formattedText)
}

export {parse};