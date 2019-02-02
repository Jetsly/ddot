import * as Config from 'webpack-chain';
import { ICFG } from '../utils';

export default (config: Config, cfgset: ICFG) => {
  const devMode = process.env.NODE_ENV !== 'production';
  // css
  const cssRule = config.module
    .rule('rule-css')
    .test(/\.(le|c)ss$/i)
    .exclude.add(/node_modules/)
    .end();
  if (devMode) {
    cssRule.use('css-hot-loader').loader(require.resolve('css-hot-loader'));
  }
  cssRule
    .use('extract-css-loader')
    .loader(require('mini-css-extract-plugin').loader);
  cssRule
    .use('css-loader')
    .loader(require.resolve('css-loader'))
    .options(cfgset.extraCSSOptions);
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
      ...cfgset.lessLoaderOptions,
    });
    
  // node_modules css
  const cssNodeModulesRule = config.module
    .rule('rule-nodemoduels-css')
    .test(/\.(le|c)ss$/i)
    .include.add(/node_modules/)
    .end();
  cssNodeModulesRule
    .use('extract-css-loader')
    .loader(require('mini-css-extract-plugin').loader);
  cssNodeModulesRule.use('css-loader').loader(require.resolve('css-loader'));
  cssNodeModulesRule
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
  cssNodeModulesRule
    .use('less-loader')
    .loader(require.resolve('less-loader'))
    .options({
      javascriptEnabled: true,
      ...cfgset.lessLoaderOptions,
    });
};
