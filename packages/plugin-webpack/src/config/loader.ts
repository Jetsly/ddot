import { sync } from 'find-up';
import * as Config from 'webpack-chain';
import { ICFG } from '../utils';
import cssRule from './css-rule';

const DEFAULT_INLINE_LIMIT = 10000;

export default (config: Config, cfgset: ICFG) => {
  cssRule(config, cfgset);
  config.module
    .rule('mjs')
    .test(/\.mjs$/)
    .type('javascript/auto')
    .end();
  // ts
  const { transformers, ...restTsLoaderOption } = cfgset.tsLoaderOption;

  const tsImport = cfgset.tsImportOption.length
    ? [require('ts-import-plugin')(cfgset.tsImportOption)]
    : [];

  const compile = config.module.rule('compile').test(/\.(tsx?|mjs)$/i);
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
        tsconfig: sync('tsconfig.json'),
        checkSyntacticErrors: true,
        formatter: 'codeframe',
      },
    ]);
  // url
  config.module
    .rule('url')
    .test(/\.(png|jpe?g|gif|svg)$/i)
    .exclude.add(/node_modules/)
    .end()
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({
      limit: DEFAULT_INLINE_LIMIT,
      name: 'static/[name].[hash:8].[ext]',
    });
  // file
  config.module
    .rule('file')
    .test(/\.(json)$/i)
    .exclude.add(/node_modules/)
    .end()
    .use('file-loader')
    .loader(require.resolve('file-loader'));
};
