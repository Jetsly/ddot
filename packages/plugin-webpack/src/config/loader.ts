import * as Config from 'webpack-chain';
import { getCfgSetting } from '../utils';

const DEFAULT_INLINE_LIMIT = 10000;

export default (config: Config) => {
  const devMode = process.env.NODE_ENV !== 'production';
  const cfgset = getCfgSetting();
  // css
  const cssRule = config.module.rule('css').test(/\.(le|c)ss$/i);
  if (devMode) {
    cssRule.use('css-hot-loader').loader(require.resolve('css-hot-loader'));
  }
  cssRule
    .use('extract-css-loader')
    .loader(require('mini-css-extract-plugin').loader);
  cssRule.use('css-loader').loader(require.resolve('css-loader'));
  cssRule
    .use('postcss-loader')
    .loader(require.resolve('postcss-loader'))
    .options({
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('autoprefixer')({
          browsers: cfgset.browserlist,
          flexbox: 'no-2009',
        }),
        ...cfgset.extraPostCSSPlugins,
      ],
    });
  cssRule
    .use('less-loader')
    .loader(require.resolve('less-loader'))
    .options({
      javascriptEnabled: true,
    });
  // ts
  const { transformers, ...restTsLoaderOption } = cfgset.tsLoaderOption;
  const tsImport = cfgset.tsImportOption.length
    ? [require('ts-import-plugin')(cfgset.tsImportOption)]
    : [];
  const compile = config.module.rule('compile').test(/\.tsx?$/i);
  compile
    .use('ts-loader')
    .loader(require.resolve('ts-loader'))
    .options({
      transpileOnly: true,
      happyPackMode: true,
      ...restTsLoaderOption,
      getCustomTransformers: () => ({
        before: tsImport.concat(transformers.before || []),
        after: transformers.after || [],
      }),
    });
  config
    .plugin('fork-ts-checker')
    .use(require('fork-ts-checker-webpack-plugin'), [
      {
        checkSyntacticErrors: true,
        formatter: 'codeframe',
      },
    ]);
  // url
  config.module
    .rule('url')
    .test(/\.(png|jpe?g|gif|svg)$/i)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({
      limit: DEFAULT_INLINE_LIMIT,
      name: 'static/[name].[hash].[ext]',
    });
  // file
  config.module
    .rule('file')
    .test(/\.(json)$/i)
    .use('file-loader')
    .loader(require.resolve('file-loader'));
};
