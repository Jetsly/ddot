import { ddotContainer, pluginsCfg } from '@ddot/plugin-utils';
import { ChainedMap } from 'webpack-chain';
// tslint:disable-next-line:no-var-requires
export const pluginsName = require('../package.json').name;

export interface IConfig {
  chainWebpack: (config: ChainedMap<void>, { webpack }) => void;
}
export const cfg: {
  info: IConfig;
} = {
  get info() {
    return ddotContainer.get<IConfig>(pluginsCfg(pluginsName));
  },
};
