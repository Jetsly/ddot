import { CONFIG_KEYS, Container, Interfaces, TYPES } from '@ddot/plugin-utils';
import chalk from 'chalk';
import * as cliui from 'cliui';
import * as cosmiconfig from 'cosmiconfig';
import * as resolveCwd from 'resolve-cwd';
import { warn } from 'signale';

export const moduleName = 'ddot';

export interface IConfig {
  plugins: Array<string | [string, any]>;
}

export const loadCfg: (name: string) => { config: IConfig } = name => {
  const explorer = cosmiconfig(name);
  return explorer.searchSync();
};

const getModuleId = name => {
  const pluginNames = /plugin-(\w+)$/.exec(name);
  return pluginNames ? pluginNames[1] : name;
};

export const loadPlugins = (cfg: IConfig) => {
  cfg.plugins.forEach(plugin => {
    const [moduleId, value] = Array.isArray(plugin) ? plugin : [plugin, {}];
    const pluginName = getModuleId(moduleId);
    const pluginModule =
      resolveCwd.silent(`@ddot/ddot-${moduleId}`) ||
      resolveCwd.silent(`@ddot/ddot-plugin-${moduleId}`) ||
      resolveCwd.silent(moduleId) ||
      resolveCwd(`${__dirname}/imp/${pluginName}/index`);
    if (pluginModule) {
      const serviceIdentifier = CONFIG_KEYS.PLUGIN_CFG_KEY(pluginName);
      Container.main.bind(serviceIdentifier.trim()).toConstantValue(value);
      require(pluginModule);
    } else {
      warn('not found plugin id: ' + moduleId);
    }
  });
};

export const getAllCli: () => Array<Interfaces.Icli<any>> = () => {
  if (!Container.main.isBound(TYPES.Icli)) {
    return [];
  }
  return Container.main.getAll<Interfaces.Icli<any>>(TYPES.Icli);
};

export const getCommandName = command => command.split(' ')[0];

export const showHelp = (
  allcli: Array<Interfaces.Icli<any>>,
  isHelp: boolean = false
) => {
  const ui = cliui({
    width: 70,
  });
  const divLine = isHelp ? 'Options:' : 'Commands:';
  const command = isHelp ? allcli[0].command : '<command> [options]';
  ui.div({
    text: `Usage: ${moduleName} ${command}`,
    padding: [1, 0, 1, 2],
  });
  ui.div({
    text: divLine,
    padding: [0, 0, 1, 2],
  });
  if (isHelp) {
    const { builder, describe } = allcli[0];
    if (builder && typeof builder === 'object') {
      Object.keys(builder).forEach(options => {
        ui.div(
          {
            text: `--${options}`,
            width: 14,
            padding: [0, 0, 0, 4],
          },
          {
            text: `[${Object.keys(builder[options])
              .reduce(
                (pre, key) => pre.concat(`${key}: ${builder[options][key]}`),
                []
              )
              .join(', ')}]`,
            align: 'right',
          }
        );
      });
    }
    ui.div({
      text: `run ${chalk.blue(
        `${moduleName} ${getCommandName(command)}`
      )} for ${describe}`,
      padding: [1, 0, 1, 2],
    });
  } else {
    allcli.forEach(cli => {
      ui.div(
        {
          text: chalk.green(getCommandName(cli.command)),
          width: 14,
          padding: [0, 0, 0, 4],
        },
        {
          text: cli.describe,
        }
      );
    });
    ui.div({
      text: `run ${chalk.blue(
        `${moduleName} help [command]`
      )} for usage of a specific command.`,
      padding: [1, 0, 1, 2],
    });
  }
  // add enter to new line
  process.stdout.write(`${ui.toString()}
  `);
};
