
export class Parser {
  #formatForParse
  #preformattedTextMap
  #nestedRegex

  constructor(formatForParse) {
    this.formatForParse = formatForParse
    this.preformattedTextMap = new Map();
    this.nestedRegex = [
      /^(\s*-\s+.+(\n|$))+/gm,
      /^(#+)\s+.+(\n|$)/gm,
      /^(>\s+.+(\n|$))+/gm,
    ]
  }

   validateNestedMarkdown (markdown) {
    for (const regex of this.nestedRegex) {
      if (markdown.match(regex)) throw new Error('Markdown should not have nested tags');
    }
    return false
  }

   validateTags (markdown)  {
    const markdownTags = this.getMarkdownTags(markdown);
     this.hasNestedAndPairedTags(markdownTags);
  }

   getMarkdownTags (markdown)  {
    const markdownTagsRegex = /[\*\`]+/g;
    if (!this.validateUnderscores(markdown)) throw new Error('Markdown shouldn not have nested tags')
    return markdown.match(markdownTagsRegex);
  }

   hasNestedAndPairedTags (tags) {
    if (!tags) return;
    if (tags.length % 2) throw new Error('Markdown shouldn not have unclosed tags')
    for (let i = 0; i < tags.length; i+=2) {
      if (tags[i] !== tags[i+1]) {
        throw new Error('Markdown has nested tags');
      }
    }
  }

   validateUnderscores  (markdown){
    const underscoreRegex = /_/g;
    const underScoresInUnicodeRegex = /(?<=[^\s.,])_(?=[^\s.,])/g;
    const underScoreTagsRegex = /(?<=[ ,.:;\n\t]|^)_(?=\S)(.+?)(?<=\S)_(?=[ ,.:;\n\t]|$)/g;
    const withoutEmptyUnderScores = this.removeEmptyUnderscores(markdown);

    const tags = withoutEmptyUnderScores.match(underScoreTagsRegex) ? withoutEmptyUnderScores.match(underScoreTagsRegex).join(',') : '';
     const markdownTagsRegex = /[\*\`]+/g;
     const otherMarkdownTags = tags.match(markdownTagsRegex) ? tags.match(markdownTagsRegex).length : 0;
     if (otherMarkdownTags) return false;

     const tagsUnderscores = tags.match(underscoreRegex) ? tags.match(underscoreRegex).length : 0;
     const snakeCases = withoutEmptyUnderScores.match(underScoresInUnicodeRegex) ? withoutEmptyUnderScores.match(underScoresInUnicodeRegex).length : 0;
     const snakeCasesInTags = tags.match(underScoresInUnicodeRegex) ? tags.match(underScoresInUnicodeRegex).length : 0;

     const validatedUnderscores = tagsUnderscores + snakeCases - snakeCasesInTags;
     const withoutEmpty = withoutEmptyUnderScores.match(underscoreRegex) ? withoutEmptyUnderScores.match(underscoreRegex).length : 0
     return withoutEmpty === validatedUnderscores;
   }

  removeEmptyUnderscores (markdown) {
    return markdown.replace(/(?<=^|\s)_+(?=\s|$)/g,'');
  }

  parseMarkdownToHtml(markdownText) {
    const html = markdownText
      .replace(/\*\*(.*?)\*\*/g, this.formatForParse.bold)
      .replace(/(?<=[ ,.:;\n\t]|^)_(?=\S)(.+?)(?<=\S)_(?=[ ,.:;\n\t]|$)/g, this.formatForParse.italic)
      .replace(/`([^`]+)`/g, this.formatForParse.monospaced)
      .replace(/(?:\r\n|\r|\n){2,}/g, this.formatForParse.paragraph)

    const preformatted = this.returnPreformatted(html);
    const modifiedPreformatted = preformatted.replace(/```([\s\S]*?)```/g, this.formatForParse.preformatted);
    return this.formatForParse.paragraphOpen + modifiedPreformatted + this.formatForParse.paragraphClose;
  }

   *preformattedHashGenerator () {
    let index = 0;
    while (true){
      yield Symbol(index);
      index++;
    }
  }

   removePreformatted (markdown) {
    const hashGenerator = this.preformattedHashGenerator();
    const preformattedRegex = /```\n([\s\S]*?)\n```/g
    const preformattedText = markdown.match(preformattedRegex);
    if (!preformattedText) return markdown;
    for (const text of preformattedText) {
      let hash = hashGenerator.next();
      this.preformattedTextMap.set(hash, text);
      markdown = markdown.replace(text, hash);
    }
    return markdown;
  }

   returnPreformatted  (markdown) {
    for (const [key, value] of this.preformattedTextMap) {
      markdown = markdown.replace(key,value);
    }
    return markdown;
  }

   parse = (markdown) => {
    const formattedText = this.removePreformatted(markdown);
    this.validateNestedMarkdown(formattedText)
    this.validateTags(formattedText);
    return this.parseMarkdownToHtml(formattedText)
  }
}