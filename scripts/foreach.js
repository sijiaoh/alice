const { execSync } = require('child_process');
const { packages, toPackagePath } = require('./utils');

const command = process.argv.slice(2).join(' ');

let exitCode = 0;

packages.forEach((pkg) => {
  const path = toPackagePath(pkg);

  try {
    const stdout = execSync(command, { cwd: path }).toString();
    console.info(`${pkg} done.`);
    if (stdout) console.info(stdout);
  } catch (e) {
    console.error(`${pkg} error.`);
    const stdout = e.stdout.toString();
    if (stdout) console.error(stdout);
    const stderr = e.stderr.toString();
    if (stderr) console.error(stderr);
    exitCode = -1;
  }
});

process.exit(exitCode);
