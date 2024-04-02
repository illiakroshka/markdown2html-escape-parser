import { test } from 'node:test'
import assert  from 'node:assert'
import { Parser } from "./parser.js";
import { escapeFormat } from "./formats/escapeFormat.js";
import { htmlFormat } from "./formats/htmlFormat.js";

test.describe('validation tests', async () => {
  const parser = new Parser(escapeFormat);

  test.it('should validate nested tags', () => {
    const flag = parser.validateNestedMarkdown('#Hello');
    assert.strictEqual(flag,false);
  })

  test.it('should validate unclosed tags', () => {
    const invalidMarkdown = '**Вовк** каже хочу, заєць каже бачиш _стовп_ щас крізь нього проїдемо **тільки** очі _закрий'
    assert.throws(() => parser.validateTags(invalidMarkdown), Error);
  })

  test.it('should validate nested tags', () => {
    const invalidMarkdown = '**Вовк** каже хочу, заєць каже бачиш _стовп_ щас крізь нього проїдемо **тільки** очі _*закрий*_'
    assert.throws(() => parser.validateTags(invalidMarkdown), Error);
  })

  test.it('should remove preformatted', () => {
    const markdown = 'Тільки очі треба **закрити** всі погодилися, вовк набирає швидкість їдуть _200км_ на годину' +
      '\n' +
      '```\n' +
      'Невідомий **автор**\n' +
      '```'
    const text = parser.removePreformatted(markdown);
    const preformattedRegex = /```\n([\s\S]*?)\n```/g
    const preformattedText = text.match(preformattedRegex);
    assert.strictEqual(preformattedText,null);
  })
})

test.describe('parsing to html',() => {
  const parser = new Parser(htmlFormat);

  test.it('should parse html', () => {
    const markdown = '**Вовк** покликав **білочок**, **лисичок** їдуть трасою вовк каже у мене машина _форд_, хочете **фокус**?';
    const html = parser.parse(markdown);
    assert.strictEqual(html,'<p><b>Вовк</b> покликав <b>білочок</b>, <b>лисичок</b> їдуть трасою вовк каже у мене машина <i>форд</i>, хочете <b>фокус</b>?</p>');
  })

  test.it('should parse snake case', () => {
    const markdown = '_форд_фокус_'
    const html = parser.parse(markdown);
    assert.strictEqual(html, '<p><i>форд_фокус</i></p>')
  })
})

test.describe('parsing to escape',() => {
  const parser = new Parser(escapeFormat);

  test.it('should parse to escape', () => {
    const markdown = '**Вовк** покликав **білочок**, **лисичок** їдуть трасою вовк каже у мене машина _форд_фокус_, хочете **фокус**?';
    const escape = parser.parse(markdown);
    assert.strictEqual(escape,'\x1B[0m\n\x1B[1mВовк\x1B[22m покликав \x1B[1mбілочок\x1B[22m, \x1B[1mлисичок\x1B[22m їдуть трасою вовк каже у мене машина \x1B[3mфорд_фокус\x1B[23m, хочете \x1B[1mфокус\x1B[22m?\x1B[0m\n');
  })

  test.it('should work without tags',() => {
    const markdown = 'Анектод про форд фокус';
    const escape = parser.parse(markdown);
    assert.strictEqual(escape,'\x1B[0m\nАнектод про форд фокус\x1B[0m\n');
  })
})