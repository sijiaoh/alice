import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { generate } from './generate';

export const defaultPath = 'src/generated/env.ts';

const program = new Command();

program
  .command('generate [to]')
  .description(`Generate ${defaultPath} from dotenv.`)
  .action((to = defaultPath) => {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.writeFileSync(to, generate());
  });

program.parse(process.argv);
