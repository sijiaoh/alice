const fs = require('fs');
const path = require('path');

const projectCwd = process.env.PROJECT_CWD || path.dirname(__dirname);
const packagesPath = path.join(projectCwd, 'packages');
const packages = fs.readdirSync(packagesPath);
const toPackagePath = (name) => path.join(packagesPath, name);

module.exports = { projectCwd, packagesPath, packages, toPackagePath };
