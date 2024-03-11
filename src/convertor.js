'use strict'

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
  const markdownTagsRegex = /[\*\`]+/g;
  if (!validateUnderscores(markdown)) throw new Error('Markdown shouldn not have unclosed tags')
  return markdown.match(markdownTagsRegex);
}

const hasNestedAndPairedTags = (tags) => {
  if (!tags) return;
  if (tags.length % 2) throw new Error('Markdown shouldn not have unclosed tags')
  for (let i = 0; i < tags.length; i+=2) {
    if (tags[i] !== tags[i+1]) {
      throw new Error('Markdown has nested tags');
    }
  }
}

const validateUnderscores = (markdown) => {
  const underscoreRegex = /_/g;
  const underScoresInUnicodeRegex = /(?<=[^\s.,])_(?=[^\s.,])/g;
  const underScoreTagsRegex = /(?<=[ ,.:;\n\t]|^)_(?=\S)(.+?)(?<=\S)_(?=[ ,.:;\n\t]|$)/g;
  const withoutEmptyUnderScores = removeEmptyUnderscores(markdown);
  const tags = withoutEmptyUnderScores.match(underScoreTagsRegex).join(',')

  const tagsUnderscores = tags.match(underscoreRegex).length;
  const snakeCases = withoutEmptyUnderScores.match(underScoresInUnicodeRegex).length;
  const snakeCasesInTags = tags.match(underScoresInUnicodeRegex).length;

  const validatedUnderscores = tagsUnderscores + snakeCases - snakeCasesInTags;
  return withoutEmptyUnderScores.match(underscoreRegex).length === validatedUnderscores;
}

const removeEmptyUnderscores = (markdown) => {
  return markdown.replace(/(?<=^|\s)_+(?=\s|$)/g,'');
}

function parseMarkdownToHtml(markdownText) {
  const html = markdownText
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/(?<=[ ,.:;\n\t]|^)_(?=\S)(.+?)(?<=\S)_(?=[ ,.:;\n\t]|$)/g, '<i>$1</i>')
    .replace(/`([^`]+)`/g, '<tt>$1</tt>')
    .replace(/(?:\r\n|\r|\n){2,}/g, '</p><p>')

  const preformatted = returnPreformatted(html);
  const modifiedPreformatted = preformatted.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');
  return '<p>' + modifiedPreformatted + '</p>';
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