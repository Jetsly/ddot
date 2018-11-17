import * as webpack from 'webpack';
import * as Config from 'webpack-chain';

export default (config: Config) => {
  config.plugin('mini-css').use(require('mini-css-extract-plugin'));
  config.plugin('hot-module').use(webpack.HotModuleReplacementPlugin);
  config.devtool('cheap-module-source-map');

};
