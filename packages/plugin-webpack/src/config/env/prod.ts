import { existsSync } from 'fs';
import { join, resolve } from 'path';
import * as Config from 'webpack-chain';
import { ICFG } from '../../utils';

export default (config: Config, cfgset: ICFG, { path }) => {
  const publicPath = join(path.cwd, 'public');
  const filename = cfgset.outFileName || 'assets/[name].[contenthash]';
  config.output.path(resolve(path.cwd, cfgset.outputPath));
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
    [cfgset.outputPath],
    {
      root: path.cwd,
      allowExternal: true,
    },
  ]);
  config.optimization.noEmitOnErrors(false);
  config.optimization
    .minimizer('css')
    .use(require('optimize-css-assets-webpack-plugin'));
  config.optimization.minimizer('js').use(require('uglifyjs-webpack-plugin'), [
    {
      cache: true,
      parallel: true,
      sourceMap: cfgset.sourceMap,
    },
  ]);
  if (cfgset.sourceMap) {
    config
      .plugin('source-plugin')
      .use(require('webpack').SourceMapDevToolPlugin, [
        {
          filename: 'sourcemaps/[file].map',
          fileContext: 'assets',
        },
      ]);
  }
};
