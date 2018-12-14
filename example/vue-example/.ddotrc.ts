export default {
  plugins: [
    [
      'webpack',
      {
        chainWebpack(config) {
          config
            .plugin('vue-loader-plugin')
            .use(require('vue-loader/lib/plugin'));
          config.module
            .rule('compile-vue')
            .test(/\.vue?$/i)
            .use('vue-loader')
            .loader(require.resolve('vue-loader'));
          config.output.publicPath('/econtract');
          config
            .entry('index')
            .add('./src/index')
            .end();
        },
      },
    ],
  ],
};
