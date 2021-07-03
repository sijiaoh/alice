/* eslint-disable no-console */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { packages, toPackagePath } = require('./utils');

const packageDatas = packages.map((name) => {
  const packagePath = toPackagePath(name);
  const packageJsonPath = path.join(packagePath, 'package.json');
  const packageJson = fs.readFileSync(packageJsonPath);
  const dependencies = packages.filter((pName) =>
    packageJson.includes(`workspace:packages/${pName}`)
  );
  return {
    name,
    dependencies,
  };
});

const getPackageData = (name) =>
  packageDatas.find((packageData) => packageData.name === name);

const hasCircular = packageDatas.some((packageData) =>
  packageData.dependencies.some((dependency) =>
    getPackageData(dependency).dependencies.includes(packageData.name)
  )
);

if (hasCircular) throw new Error('循環参照しているパッケージが存在します。');

const prepublished = [];

while (prepublished.length !== packages.length) {
  const notPrepublishes = packages.filter(
    (name) => !prepublished.includes(name)
  );
  notPrepublishes.forEach((name) => {
    const ready = getPackageData(name).dependencies.every((dependency) =>
      prepublished.includes(dependency)
    );
    if (!ready) return;
    try {
      execSync('yarn prepublish', { cwd: toPackagePath(name) });
      console.info(`${name} done.`);
    } catch (e) {
      const stdout = e.stdout.toString();

      if (
        stdout.includes(
          'Usage Error: Couldn\'t find a script named "prepublish".'
        )
      )
        return;

      console.error(`${name} error.`);
      if (stdout) console.error(stdout);
      const stderr = e.stderr.toString();
      if (stderr) console.error(stderr);
      process.exit(-1);
    } finally {
      prepublished.push(name);
    }
  });
}
