import {
  CFG_KEY,
  ddotContainer,
  Interfaces,
  PLUGIN_CFG_KEY,
  TYPES,
} from '@ddot/plugin-utils';
import { blue, green, red } from 'chalk';
import * as cliui from 'cliui';
import * as cosmiconfig from 'cosmiconfig';
import * as resolveCwd from 'resolve-cwd';
import { IJenkinsConfig } from './imp/jenkins';

export const moduleName = 'ddot';

export interface IConfig {
  jenkins: IJenkinsConfig;
  plugins: string[];
}

export const loadCfg: (name: string) => { config: IConfig } = name => {
  const explorer = cosmiconfig(name);
  return explorer.searchSync();
};

export const loadConfig: (cfg: IConfig) => void = cfg => {
  const { plugins, ...keys } = cfg;
  Object.keys(keys).forEach(key => {
    ddotContainer.rebind(CFG_KEY(key)).toConstantValue(cfg[key]);
  });
};

export const loadPlugins = (cfg: IConfig) => {
  cfg.plugins.forEach(plugin => {
    const [name, values] = Array.isArray(plugin) ? plugin : [plugin, {}];
    require(resolveCwd(name));
    ddotContainer.bind(PLUGIN_CFG_KEY(name)).toConstantValue(values);
  });
};

export const getAllCli: () => Array<Interfaces.Icli<any>> = () => {
  if (!ddotContainer.isBound(TYPES.Icli)) {
    return [];
  }
  return ddotContainer.getAll<Interfaces.Icli<any>>(TYPES.Icli);
};

export const showHelp = (allcli: Array<Interfaces.Icli<any>>) => {
  const ui = cliui();
  ui.div({
    text: `Usage: ${moduleName} <command> [options]`,
    padding: [1, 0, 1, 2],
  });
  ui.div({
    text: 'Commands:',
    padding: [0, 0, 1, 2],
  });
  allcli.forEach(cli => {
    ui.div(
      {
        text: green(cli.command.split(' ')[0]),
        width: 14,
        padding: [0, 0, 0, 4],
      },
      {
        text: cli.describe,
      }
    );
  });
  ui.div({
    text: `run ${blue(`${moduleName} [command]`)} for a specific command.`,
    padding: [1, 0, 2, 2],
  });
  process.stdout.write(ui.toString());
};
