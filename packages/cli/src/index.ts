import { ddotContainer, Interfaces, TYPES } from '@ddot/plugin-utils';
import chalk from 'chalk';
import * as cosmiconfig from 'cosmiconfig';
import * as resolveCwd from 'resolve-cwd';
import { error } from 'signale';
import { argv, usage } from 'yargs';
interface IConfig {
  config: {
    plugins: string[];
  };
}
const moduleName = 'ddot';

const loadCfg: (name: string) => IConfig = name => {
  const explorer = cosmiconfig(name);
  return explorer.searchSync();
};
const loadPlugins = (cfg: IConfig) => {
  if (!cfg) { return }
  const { config: { plugins = [] } } = cfg
  plugins.forEach(plugin => {
    require(resolveCwd(plugin));
  });
};

const getAllCli: () => Interfaces.Icli[] = () => {
  if (!ddotContainer.isBound(TYPES.Icli)) {
    return [];
  }
  return ddotContainer.getAll<Interfaces.Icli>(TYPES.Icli);
};

const getTargetCli: (
  commandName: string
) => Interfaces.Icli[] = commandName => {
  if (!ddotContainer.isBoundNamed(TYPES.Icli, commandName)) {
    return [];
  }
  return ddotContainer.getAllNamed<Interfaces.Icli>(TYPES.Icli, commandName);
};

loadPlugins(loadCfg(moduleName));

const [targetCommand] = argv._;
let clis = [];
if (targetCommand === undefined) {
  const cmd = getAllCli()
    .reduce(
      (_, { command: [name, ...otherCommand] }) =>
        _.command(chalk.green(name), ...otherCommand),
      usage(`\nUsage: $0 <command> [options]`)
    )
    .help('h')
    .alias('h', 'help')
    .epilogue(
      `run ${chalk.blue('$0 help [command]')} for usage of a specific command..`
    )
    .showHelp()
    .argv;
} else if ((clis = getTargetCli(targetCommand)).length === 0) {
  error(`Command ${chalk.underline.cyan(targetCommand)} does not exists`);
} else {
  clis.forEach(cli => cli.run());
}
