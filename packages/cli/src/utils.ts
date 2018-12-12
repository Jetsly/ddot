import chalk from 'chalk';
import * as cliui from 'cliui';
import * as cosmiconfig from 'cosmiconfig';

export const moduleName = 'ddot';
export const tsExt = '.ts';

export const esModule = module => module.default || module;
export const isFunction = o => typeof o === 'function';

export const getModulePaths = ({ moduleId }) => [
  `@ddot/ddot-plugin-${moduleId}`,
  `@ddot/ddot-${moduleId}`,
  moduleId,
];

export const resolveCwd = moduleId => {
  try {
    return require.resolve(moduleId);
  } catch (error) {
    return null;
  }
};

export const loadCfg: (
  name?: string
) => {
  plugins: Array<string | [string, any]>;
} = (name = moduleName) => {
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
  return esModule(result.config);
};

export const showHelp = hooks => {
  const ui = cliui({
    width: 70,
  });
  const divLine = 'Commands:';
  const command = '<command> [options]';
  ui.div({
    text: `Usage: ${moduleName} ${command}`,
    padding: [1, 0, 1, 2],
  });
  ui.div({
    text: divLine,
    padding: [0, 0, 1, 2],
  });
  Object.keys(hooks).forEach(cli => {
    ui.div(
      {
        text: chalk.green(cli),
        width: 14,
        padding: [0, 0, 0, 4],
      },
      {
        text: hooks[cli].describe,
      }
    );
  });
  ui.div({
    text: `run ${chalk.blue(
      `${moduleName}`
    )} <command> for a specific command.`,
    padding: [1, 0, 1, 2],
  });
  process.stdout.write(`${ui.toString()}\n`);
};
