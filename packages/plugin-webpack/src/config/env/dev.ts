import * as webpack from 'webpack';
import * as Config from 'webpack-chain';
import { ICFG } from '../../utils';

export default (config: Config, cfgset: ICFG,{path }) => {
  config.plugin('mini-css').use(require('mini-css-extract-plugin'));
  config.plugin('hot-module').use(webpack.HotModuleReplacementPlugin);
  config.devtool('cheap-module-source-map');

};
