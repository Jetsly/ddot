import {
  ddotContainer,
  Interfaces,
  pluginsCfg,
  TYPES,
} from '@ddot/plugin-utils';
import * as cosmiconfig from 'cosmiconfig';
import * as resolveCwd from 'resolve-cwd';
import { argv, showHelp, usage } from 'yargs';
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
  cfg.config.plugins.forEach(plugin => {
    const [name, values] = Array.isArray(plugin) ? plugin : [plugin, {}];
    require(resolveCwd(name));
    ddotContainer.bind(pluginsCfg(name)).toConstantValue(values);
  });
};

const getAllCli: () => Interfaces.Icli[] = () => {
  if (!ddotContainer.isBound(TYPES.Icli)) {
    return [];
  }
  return ddotContainer.getAll<Interfaces.Icli>(TYPES.Icli);
};

loadPlugins(loadCfg(moduleName));
// tslint:disable-next-line:no-unused-expression
getAllCli()
  .reduce(
    (_, command) => _.command(command),
    usage(`Usage: $0 <command> [options]`)
  )
  .version(false)
  .help(false).argv;

const [targetCommand] = argv._;
if (targetCommand === undefined) {
  showHelp();
}
