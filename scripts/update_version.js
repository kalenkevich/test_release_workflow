import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';

const execAsync = promisify(exec);

const dirname = process.cwd();

function getVersionFileContent(newVersion) {
  return `
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// version: major.minor.patch
export const version = '${newVersion}';
`.trim();
}

async function npmVersion(versionType, projectDir) {
  await execAsync(`npm version ${versionType}`, { cwd: projectDir, stdio: 'inherit' });
  const packageJsonPath = path.join(projectDir, 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

  return packageJson.version;
}

function parseArgs(args) {
  const result = {};

  for (let arg of args) {
    const [key, value] = arg.split('=');
    const name = key.replace('--', '');
    result[name] = value;
  }

  return result;
}

async function updateDependencyVersion(projectDir, packageName, targetVersion) {
  const packageJsonPath = path.join(projectDir, 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

  packageJson.dependencies[packageName] = `^${targetVersion}`;

  return fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

/**
 * Updates the version of a package and its dependencies.
 * 
 * @param package - name of the package to update
 * @param version - new version to set. Either 'major', 'minor', 'patch' or a specific version number.
 * @returns Result version of the updated package.
 */
async function main({ package: packageName, version }) {
  const projectDir = path.join(dirname, packageName);
  const newVersion = await npmVersion(version, projectDir);

  await fs.writeFile(path.join(projectDir, 'src', 'version.ts'), getVersionFileContent(newVersion));

  if (packageName === 'dev') {
    await updateDependencyVersion(projectDir, '@kalenkevich/test_release_workflow', newVersion);
  }

  return newVersion;
}

main(parseArgs(process.argv.slice(2))).then(newVersion => process.stdout.write(`${newVersion}\n`));