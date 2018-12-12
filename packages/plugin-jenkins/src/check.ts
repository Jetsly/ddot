import { exec } from 'shelljs';
import { error } from 'signale';

const JENKINS_TOKEN = 'JENKINS_TOKEN';
const COMMAND = 'Jenkins';

function execShell(shellstr) {
  return exec(shellstr, {
    silent: true,
  }).stdout.trim();
}

export function checkConfig(config) {
  const token = execShell(`npm config get ${JENKINS_TOKEN}`);
  const defaultBranch = execShell(
    "git status | head -n 1  | awk '{print  $3}'"
  );
  if (token === 'undefined') {
    return error(`${JENKINS_TOKEN} not set, please npm config set `);
  }
  if (config === undefined) {
    return error(`${COMMAND} config not set, please set ${COMMAND} config `);
  }
  return [token, defaultBranch];
}
