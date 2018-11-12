import * as Config from 'webpack-chain';
import * as webpackbar from 'webpackbar';

// tslint:disable-next-line:no-var-requires
export const pluginsName = require('../package.json').name;
export interface IConfig {
  chainWebpack: (config: Config.ChainedMap<void>, { webpack }) => void;
}

export function chainConfig() {
  const config = new Config();
  config.plugin('progress').use(webpackbar);
  return config;
}
