import chalk from 'chalk';
import { warn } from 'signale';
import { argv, usage } from 'yargs';
import {
  getAllCli,
  getCommandName,
  loadCfg,
  loadPlugins,
  moduleName,
  registerTs,
  showHelp,
} from './utils';

registerTs();
const config = loadCfg(moduleName);
loadPlugins(config);
const allCli = getAllCli();
const cmd = allCli
  .reduce((_, cli) => {
    const { command, describe, builder, handler } = cli;
    return _.command({
      command,
      describe,
      builder,
      handler: handler.bind(cli),
    });
  }, usage(`Usage: $0 <command> [options]`))
  .version(false)
  .showHelpOnFail(false)
  .help(false);

// tslint:disable-next-line:no-unused-expression
cmd.parse();
const [name, option] = argv._;
const isHelp = name === 'help';
try {
  if (name === undefined || isHelp) {
    const clilist = isHelp
      ? allCli.filter(({ command }) => getCommandName(command) === option)
      : allCli;
    if (clilist.length) {
      showHelp(clilist, isHelp);
    } else if (allCli.length > 0) {
      throw new RangeError();
    }
  } else if (
    allCli.filter(({ command }) => getCommandName(command) === name).length ===
    0
  ) {
    throw new RangeError();
  }
} catch (err) {
  warn(`Command ${chalk.cyan(isHelp ? option : name)} does not exists`);
}
