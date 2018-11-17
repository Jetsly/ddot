import { path } from '@ddot/plugin-utils';
import { existsSync } from 'fs';
import { join } from 'path';
import * as Config from 'webpack-chain';

export default (config: Config) => {
  const publicPath = join(path.cwd, 'public');
  const filename = '[name].[chunkhash]';
  config.output.chunkFilename(`${filename}.js`);
  config.output.filename(`${filename}.js`);
  config.plugin('mini-css').use(require('mini-css-extract-plugin'), [
    {
      filename: `${filename}.css`,
      chunkFilename: `${filename}.css`,
    },
  ]);
  if (existsSync(publicPath)) {
    config.plugin('copy-public').use(require('copy-webpack-plugin'), [
      [
        {
          from: publicPath,
        },
      ],
    ]);
  }
  config.plugin('clean-webpack').use(require('clean-webpack-plugin'), [
    ['dist'],
    {
      root: path.cwd,
    },
  ]);
  config.optimization
    .minimizer('css')
    .use(require('optimize-css-assets-webpack-plugin'));
  config.optimization.minimizer('js').use(require('uglifyjs-webpack-plugin'), [
    {
      cache: true,
      parallel: true,
      sourceMap: false,
    },
  ]);
};
