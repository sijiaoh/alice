import fs from 'fs';
import { EOL } from 'os';
import path from 'path';
import { program } from 'commander';
import glob from 'glob';

const token = '// index-generator';

program.command('generate', { isDefault: true }).action(() => {
  glob('**/index.ts', (err, filePaths) => {
    if (err) throw err;
    filePaths.forEach((filePath) => {
      const file = fs.readFileSync(filePath).toString();
      const skip = !file.startsWith(token);
      if (skip) return;

      const dirName = path.dirname(filePath);
      const fileNames = fs.readdirSync(dirName);

      let newIndex = `${token + EOL}`;
      newIndex +=
        fileNames
          .filter(
            (fileName) =>
              !fileName.startsWith('index.') &&
              !fileName.includes('.test.') &&
              !fileName.startsWith('__')
          )
          .filter((fileName) => {
            const stat = fs.statSync(path.join(dirName, fileName));
            if (stat.isFile()) return true;
            try {
              fs.statSync(path.join(fileName, 'index.ts'));
              return true;
            } catch {
              return false;
            }
          })
          .map((fileName) => `export * from './${path.parse(fileName).name}';`)
          .join(EOL) + EOL;

      fs.writeFileSync(filePath, newIndex);
    });
  });
});

program.parse(process.argv);
