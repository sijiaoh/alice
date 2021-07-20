const execa = require('execa');
const { program } = require('commander');
const { packages, toPackagePath } = require('./utils');

const runTest = async (pkg) => {
  const pkgPath = toPackagePath(pkg);
  await execa('yarn', ['jest', '--runInBand', '--passWithNoTests', pkgPath], {
    env: { ...process.env, PKG: pkg },
    stdio: 'inherit',
  }).catch((err) => {
    if (err.stdout) console.error(err.stdout);
    if (err.stderr) console.error(err.stderr);
    process.exit(-1);
  });
};

program.command('all', { isDefault: true }).action(async () => {
  for (let i = 0; i < packages.length; i += 1) {
    const pkg = packages[i];
    // eslint-disable-next-line no-await-in-loop
    await runTest(pkg);
  }
});

program.command('workspace <package>').action(async (pkg) => {
  if (!packages.includes(pkg))
    throw new Error(`${pkg} is illegal package name.`);
  await runTest(pkg);
});

program.parse(process.argv);
