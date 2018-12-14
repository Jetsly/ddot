import { existsSync } from 'fs';
import { join } from 'path';
import * as webpack from 'webpack';
import * as Config from 'webpack-chain';
import addLoader from './loader';

import { ICFG, isInteractive } from '../utils';

const friendlyProgress = config => {
  const { CLEAR_CONSOLE = '' } = process.env;
  if (isInteractive) {
    config.plugin('progress').use(require('webpackbar'));
  }
  // / filter `Conflicting order between` warning
  config
    .plugin('filter-css-conflicting-warnings')
    .use(require('../plugins/FilterCSSWarning.js').default);
  config
    .plugin('friendly-errors')
    .use(require('friendly-errors-webpack-plugin'), [
      {
        clearConsole: CLEAR_CONSOLE !== 'none',
        onErrors(severity, errors) {
          const unOutputError = errors.filter(
            err =>
              err.module === undefined &&
              err.type === 'module-not-found' &&
              err.webpackError.dependencies &&
              err.webpackError.dependencies.length &&
              err.webpackError.dependencies[0].options
          );
          if (severity === 'error' && unOutputError.length) {
            process.stdout.write(`This relative module was not found:\n\n`);
            unOutputError
              .map(err => ({
                ...err,
                module: err.webpackError.dependencies[0].options.request,
              }))
              .forEach(err =>
                process.stdout.write(`* ${err.module} in ${err.file}\n\n`)
              );
          }
        },
      },
    ]);
};

export default function chainConfig(
  mode: 'development' | 'production',
  cfgset: ICFG,
  { path }
) {
  process.env.NODE_ENV = mode;
  const config = new Config();
  config.mode(mode);
  config.output.publicPath('/');
  config.output.hashDigestLength(8);
  config.optimization.splitChunks({
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
      },
    },
  });
  config.resolve.extensions.merge(['.js', '.jsx', '.ts', '.tsx', '.vue']);
  Object.keys(cfgset.alias).forEach(aliasKey =>
    config.resolve.alias.set(aliasKey, cfgset.alias[aliasKey])
  );
  config.plugin('define').use(webpack.DefinePlugin, [
    Object.keys(cfgset.define).reduce(
      (preDefind, defineKey) => ({
        ...preDefind,
        [defineKey]: JSON.stringify(cfgset.define[defineKey]),
      }),
      {}
    ),
  ]);
  friendlyProgress(config);
  const tplFileName = 'document.ejs';
  const tpl = join(path.absPagesPath, tplFileName);
  config.plugin('html-webpack').use(require('html-webpack-plugin'), [
    {
      title: cfgset.title,
      template: existsSync(tpl)
        ? tpl
        : join(__dirname, '../../tpl', tplFileName),
    },
  ]);
  config.plugin('hash-module').use(webpack.HashedModuleIdsPlugin);
  if (mode === 'development') {
    require('./env/dev').default(config, cfgset, { path });
  } else {
    require('./env/prod').default(config, cfgset, { path });
  }
  addLoader(config, cfgset);
  cfgset.chainWebpack(config);
  return config;
}
