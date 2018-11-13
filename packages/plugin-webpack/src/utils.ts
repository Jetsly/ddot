import { Container, path } from '@ddot/plugin-utils';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import * as Config from 'webpack-chain';
import { gzipSync } from 'zlib';

// tslint:disable-next-line:no-var-requires
export const pluginsName = 'webpack';
const isInteractive = process.stdout.isTTY;

interface IConfig {
  chainWebpack: (config: Config.ChainedMap<void>) => void;
}

function addCfg(config) {
  const cfg = Container.getCfg<IConfig>(pluginsName);
  if (cfg) {
    cfg.chainWebpack(config);
  }
}

export function chainConfig(mode: 'development' | 'production') {
  const { CLEAR_CONSOLE = '' } = process.env;
  // const isProd = mode === 'production';
  const config = new Config();
  // tslint:disable-next-line:no-string-literal
  config['mode'](mode);
  config.output.hashDigestLength(8);
  if (isInteractive) {
    config.plugin('progress').use(require('webpackbar'));
  }
  config
    .plugin('friendly-errors')
    .use(require('friendly-errors-webpack-plugin'), [
      {
        clearConsole: CLEAR_CONSOLE !== 'none',
      },
    ]);
  if (existsSync(join(path.cwd, 'public'))) {
    config.plugin('copy-public').use(require('copy-webpack-plugin'), [
      [
        {
          from: join(path.cwd, 'public'),
        },
      ],
    ]);
  }
  config.plugin('html-webpack').use(require('html-webpack-plugin'));
  addCfg(config);
  return config;
}

export function gzipSize(filePath: string) {
  return gzipSync(readFileSync(filePath)).length;
}
