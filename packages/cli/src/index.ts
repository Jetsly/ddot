import { argv, usage } from 'yargs';

import {
  getAllCli,
  loadCfg,
  loadConfig,
  loadPlugins,
  moduleName,
  showHelp,
} from './utils';

import './imp/jenkins';

const { config } = loadCfg(moduleName);
loadConfig(config);
loadPlugins(config);
const allCli = getAllCli();
// tslint:disable-next-line:no-unused-expression
allCli
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
  .help(false).argv;

const [targetCommand] = argv._;
if (targetCommand === undefined ) {
  showHelp(allCli);
}
