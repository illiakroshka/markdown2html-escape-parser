  export const escapeFormat = {
    paragraphClose: '\x1b[0m\n',
    paragraphOpen: '\x1b[0m\n',
    bold: '\x1b[1m$1\x1b[22m',
    italic: '\x1b[3m$1\x1b[23m',
    monospaced: '\x1b[7m$1\x1b[27m',
    paragraph: '\x1b[0m\n',
    preformatted: '\x1b[7m$1\x1b[27m',
  }