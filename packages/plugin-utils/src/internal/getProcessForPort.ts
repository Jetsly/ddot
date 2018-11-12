import chalk from 'chalk';
import { execSync } from 'child_process';

const execOptions: {
  encoding: string;
  stdio: Array<'pipe' | 'ipc' | 'ignore' | 'inherit'>;
} = {
  encoding: 'utf8',
  stdio: [
    'pipe', // stdin (default)
    'pipe', // stdout (default)
    'ignore', // stderr
  ],
};

function getProcessIdOnPort(port) {
  return execSync('lsof -i:' + port + ' -P -t -sTCP:LISTEN', execOptions)
    .toString()
    .split('\n')[0]
    .trim();
}

function getProcessCommand(processId, processDirectory) {
  const command = execSync(
    'ps -o command -p ' + processId + ' | sed -n 2p',
    execOptions
  ).toString();

  return command.replace(/\n$/, '');
}

function getDirectoryOfProcessById(processId) {
  return execSync(
    'lsof -p ' +
      processId +
      ' | awk \'$4=="cwd" {for (i=9; i<=NF; i++) printf "%s ", $i}\'',
    execOptions
  )
    .toString()
    .trim();
}

function getProcessForPort(port) {
  try {
    const processId = getProcessIdOnPort(port);
    const directory = getDirectoryOfProcessById(processId);
    const command = getProcessCommand(processId, directory);
    return (
      chalk.cyan(command) +
      chalk.grey(' (pid ' + processId + ')\n') +
      chalk.blue('  in ') +
      chalk.cyan(directory)
    );
  } catch (e) {
    return null;
  }
}
export default getProcessForPort;
