import { path } from '@ddot/plugin-utils';
import { existsSync } from 'fs';
import { join } from 'path';
import * as webpack from 'webpack';
import * as Config from 'webpack-chain';

import { getCfgSetting, isInteractive, setConfig } from '../utils';

const DEFAULT_INLINE_LIMIT = 10000;

const friendlyProgress: setConfig = config => {
  const { CLEAR_CONSOLE = '' } = process.env;
  if (isInteractive) {
    config.plugin('progress').use(require('webpackbar'));
  }
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
                process.stdout.write(`* ${err.module} in ${err.file}`)
              );
          }
        },
      },
    ]);
};
const setPublic: setConfig = config => {
  const publicPath = join(path.cwd, 'public');
  if (existsSync(publicPath)) {
    config.plugin('copy-public').use(require('copy-webpack-plugin'), [
      [
        {
          from: publicPath,
        },
      ],
    ]);
  }
  config.plugin('html-webpack').use(require('html-webpack-plugin'), [
    {
      template: join(__dirname, '../../tpl/document.ejs'),
    },
  ]);
  config.plugin('hash-module').use(webpack.HashedModuleIdsPlugin);
};

const setCssRule: setConfig = config => {
  const devMode = process.env.NODE_ENV !== 'production';
  const cfgset = getCfgSetting();
  config.plugin('mini-css').use(require('mini-css-extract-plugin'));
  const rule = config.module.rule('css').test(/\.(le|c)ss$/i);
  if (devMode) {
    rule.use('css-hot-loader').loader(require.resolve('css-hot-loader'));
  }
  rule
    .use('extract-css-loader')
    .loader(require('mini-css-extract-plugin').loader);
  rule.use('css-loader').loader(require.resolve('css-loader'));
  rule
    .use('postcss-loader')
    .loader(require.resolve('postcss-loader'))
    .options({
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('autoprefixer')({
          browsers: cfgset.browserlist(),
          flexbox: 'no-2009',
        }),
      ],
    });
  rule
    .use('less-loader')
    .loader(require.resolve('less-loader'))
    .options({
      javascriptEnabled: true,
    });
};

export default function chainConfig(mode: 'development' | 'production') {
  process.env.NODE_ENV = mode;
  const config = new Config();
  const cfgset = getCfgSetting();
  const devMode = process.env.NODE_ENV !== 'production';
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
  config.resolveLoader.modules
    .add('node_modules')
    .add(join(__dirname, '../../node_modules'))
    .end();

  friendlyProgress(config);
  setPublic(config);
  setCssRule(config);

  const compile = config.module.rule('compile').test(/\.tsx?$/i);
  compile
    .use('ts-loader')
    .loader(require.resolve('ts-loader'))
    .options({
      getCustomTransformers: () => ({
        before: [require('ts-import-plugin')(cfgset.tsImportOption())],
      }),
    });

  if (devMode) {
    config.plugin('hot-module').use(webpack.HotModuleReplacementPlugin);
    config.devtool('cheap-module-source-map');
  } else {
    const filename = '[name].[chunkhash]';
    config.plugin('clean-webpack').use(require('clean-webpack-plugin'), [
      ['dist'],
      {
        root: path.cwd,
      },
    ]);
    config.output.chunkFilename(`${filename}.js`);
    config.output.filename(`${filename}.js`);
    config.plugin('mini-css').tap(args => [
      {
        ...args[0],
        filename: `${filename}.css`,
        chunkFilename: `${filename}.css`,
      },
    ]);
    config.optimization
      .minimizer('css')
      .use(require('optimize-css-assets-webpack-plugin'));
    config.optimization
      .minimizer('js')
      .use(require('uglifyjs-webpack-plugin'), [
        {
          cache: true,
          parallel: true,
          sourceMap: false,
        },
      ]);
  }

  config.module
    .rule('url')
    .test(/\.(png|jpe?g|gif|svg)$/i)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({
      limit: DEFAULT_INLINE_LIMIT,
      name: 'static/[name].[hash].[ext]',
    });

  config.module
    .rule('file')
    .test(/\.(json)$/i)
    .use('file-loader')
    .loader(require.resolve('file-loader'));

  cfgset.chainWebpack(config);
  return config;
}
