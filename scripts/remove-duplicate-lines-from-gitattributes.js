const fs = require('fs');
const { EOL } = require('os');

const gitattributes = '.gitattributes';

const text = fs.readFileSync(gitattributes).toString();
const lines = text.split(EOL);

const existsLines = [];
const newLines = lines.filter((line) => {
  if (!line || line.startsWith('#')) return true;

  const replacedLine = line.replace(/ +/g, ' ');
  if (existsLines.includes(replacedLine)) return false;

  existsLines.push(replacedLine);
  return true;
});

const newText = newLines.join(EOL);
fs.writeFileSync(gitattributes, newText);
