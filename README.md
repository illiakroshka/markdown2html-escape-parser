# Markdown to html parser

This console application parses basic markdown to html 

## Local set up

Installation
```bash
git clone https://github.com/illiakroshka/markdown2html-parser.git
```

Running app
```bash
node src/index.js  <file path>
```

For saving output to the file you can specify file path
```bash
node src/index.js  <file path> --out <file path>
```

Example
```bash
node src/index.js  sample/example.md
```

# Example

Markdown:

**Markdown** is a _lightweight_ markup _language_for_ creating `formatted` text using a plain-text editor.

_ - **John** Gruber and Aaron Swartz created _Markdown_, in 2004 as a markup `language` that_is intended to be easy to read in its source code form

```
Wikipedia **sourse**
```

HTML after parsing: 

```html
<p><b>Markdown</b> is a <i>lightweight</i> markup <i>language_for</i> creating <tt>formatted</tt> text using a plain-text editor.</p><p>_ - <b>John</b> Gruber and Aaron Swartz created <i>Markdown</i>, in 2004 as a markup <tt>language</tt> that_is intended to be easy to read in its source code form</p><p><pre>
Wikipedia **sourse**
</pre></p>
```

## Revert Commit

[Link](https://github.com/illiakroshka/markdown2html-parser/commit/aa9f7a07e2c527422c9b04ae2ec7e12a6d98be74)