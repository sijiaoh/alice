import { execSync } from 'child_process';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';
import { Command } from 'commander';

const thisPath = path.join('..', 'default-ts-configs');

interface Package {
  engines?: { node: string };
  scripts?: { [key: string]: string | undefined };
  dependencies?: { [key: string]: string | undefined };
}

const program = new Command();

const nodeVersion = () => {
  const packageJsonStr = 'package.json';

  const srcPackageJson = fs
    .readFileSync(path.join(thisPath, packageJsonStr))
    .toString();
  const srcPackage: Package = JSON.parse(srcPackageJson);
  const destPackageJson = fs.readFileSync(packageJsonStr).toString();
  const destPackage: Package = JSON.parse(destPackageJson);

  if (!srcPackage.engines) return;
  destPackage.engines = srcPackage.engines;

  fs.writeFileSync(packageJsonStr, JSON.stringify(destPackage, null, 2) + EOL);
};

const scripts = ({ force }: { force?: boolean } = {}) => {
  const packageJsonStr = 'package.json';

  const srcPackageJson = fs
    .readFileSync(path.join(thisPath, packageJsonStr))
    .toString();
  const srcPackage: Package = JSON.parse(srcPackageJson);
  const destPackageJson = fs.readFileSync(packageJsonStr).toString();
  const destPackage: Package = JSON.parse(destPackageJson);

  if (!srcPackage.scripts) return;

  destPackage.scripts ||= {};
  Object.entries(srcPackage.scripts).forEach(([key, value]) => {
    if (!destPackage.scripts![key] || force) destPackage.scripts![key] = value;
  });

  fs.writeFileSync(packageJsonStr, JSON.stringify(destPackage, null, 2) + EOL);
};

const dependencies = () => {
  const packageJsonStr = 'package.json';

  const srcPackageJson = fs
    .readFileSync(path.join(thisPath, packageJsonStr))
    .toString();
  const srcPackage: Package = JSON.parse(srcPackageJson);
  const destPackageJson = fs.readFileSync(packageJsonStr).toString();
  const destPackage: Package = JSON.parse(destPackageJson);

  if (!srcPackage.dependencies) return;

  destPackage.dependencies ||= {};
  Object.entries(srcPackage.dependencies).forEach(([key, value]) => {
    destPackage.dependencies![key] = value;
  });

  fs.writeFileSync(packageJsonStr, JSON.stringify(destPackage, null, 2) + EOL);
};

const link = ({ force }: { force?: boolean } = {}) => {
  const symlinkList = [
    '.eslintignore',
    '.eslintrc.js',
    '.eslintrc.json.js',
    '.prettierignore',
    'jest.config.js',
    'tsconfig.eslint.json',
    'tsconfig.json',
  ];

  symlinkList.forEach((file) => {
    try {
      execSync(`ln -s${force ? 'f' : ''} ${path.join(thisPath, file)} ${file}`);
    } catch {
      // Do nothing.
    }
  });
};

program
  .command('bootstrap')
  .description('Run scripts and link')
  .option('-f, --force', 'Pass force option to scripts.')
  .action(({ force }) => {
    nodeVersion();
    scripts({ force });
    dependencies();
    link({ force });
  });

program
  .command('nodeVersion')
  .description(
    'Use src package.json to override the dest package.json node version.'
  )
  .action(nodeVersion);

program
  .command('scripts')
  .description('Add default yarn scripts to package.json.')
  .option('-f, --force', 'Overwrite scripts')
  .action(scripts);

program
  .command('dependencies')
  .description('Add default yarn dependencies to package.json.')
  .action(dependencies);

program
  .command('link')
  .description('Link symlinks.')
  .option('-f, --force', 'Overwrite files.')
  .action(link);

program.parse(process.argv);
