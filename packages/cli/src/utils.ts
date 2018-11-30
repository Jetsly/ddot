import { CONFIG_KEYS, Container, Interfaces, TYPES } from '@ddot/plugin-utils';
import chalk from 'chalk';
import * as cliui from 'cliui';
import * as cosmiconfig from 'cosmiconfig';
import * as resolveCwd from 'resolve-cwd';
import { fatal, warn } from 'signale';

export const moduleName = 'ddot';
const tsExt = '.ts';

export interface IConfig {
  plugins: Array<string | [string, any]>;
}

export const registerTs = () => {
  const old = require.extensions[tsExt] || require.extensions['.js'];
  require.extensions[tsExt] = (m: any, filename: string) => {
    const ts = resolveCwd(`typescript`);
    if (ts === null) {
      fatal(new Error('Not found typescript module'));
    }
    const _compile = m._compile;
    m._compile = function(code: string, fileName: string) {
      const result = require(ts).transpileModule(code, {
        filename,
        reportDiagnostics: true,
      });
      return _compile.call(this, result.outputText, fileName);
    };
    return old(m, filename);
  };
};

export const loadCfg: (name: string) => IConfig = (name = moduleName) => {
  const explorer = cosmiconfig(name, {
    searchPlaces: [
      `.${name}rc`,
      `.${name}rc.json`,
      `.${name}rc.yaml`,
      `.${name}rc.yml`,
      `.${name}rc.js`,
      `.${name}rc.ts`,
      `${name}.config.js`,
    ],
    loaders: {
      '.json': cosmiconfig.loadJson,
      '.yaml': cosmiconfig.loadYaml,
      '.yml': cosmiconfig.loadYaml,
      '.js': cosmiconfig.loadJs,
      [tsExt]: cosmiconfig.loadJs,
      noExt: cosmiconfig.loadYaml,
    },
  });
  const result = explorer.searchSync();
  if (result === null) {
    throw new Error(`not found ${moduleName} config`);
  }
  const cfgModule = result.config;
  return cfgModule.default || cfgModule;
};

const getModuleId = name => {
  const pluginNames = /plugin-(\w+)$/.exec(name);
  return pluginNames ? pluginNames[1] : name;
};

const getModulePaths = ({ moduleId, pluginName }) => [
  `@ddot/ddot-${moduleId}`,
  `@ddot/ddot-plugin-${moduleId}`,
  `${__dirname}/imp/${pluginName}/index`,
  moduleId,
];
export const loadPlugins = (cfg: IConfig) => {
  cfg.plugins.forEach(plugin => {
    const [moduleId, value] = Array.isArray(plugin) ? plugin : [plugin, {}];
    const pluginName = getModuleId(moduleId);
    const modules = getModulePaths({ moduleId, pluginName })
      .map(id => resolveCwd.silent(id))
      .filter(has => has);
    if (modules.length) {
      const serviceIdentifier = CONFIG_KEYS.PLUGIN_CFG_KEY(pluginName);
      Container.main.bind(serviceIdentifier.trim()).toConstantValue(value);
      require(modules[0]);
    } else {
      warn(`not found plugin id: ${moduleId}, paths in:`);
      const ui = cliui();
      const paths = getModulePaths({ moduleId, pluginName });
      paths.forEach((path, idx) => {
        ui.div({
          text: `${idx === paths.length - 1 ? '└──' : '├──'}${path}`,
          padding: [0, 0, 0, 5],
        });
      });
      process.stdout.write(`${ui.toString()}\n`);
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
  process.stdout.write(`${ui.toString()}\n`);
};
