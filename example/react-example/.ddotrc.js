module.exports = {
  plugins: [
    'react',
    [
      'webpack',
      {
        chainWebpack(config) {
          config
            .entry('index')
            .add('./src/index')
            .end();
        },
      },
    ],
  ],
};
