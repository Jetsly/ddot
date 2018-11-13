module.exports = {
  plugins: [
    'plugin-react',
    [
      'plugin-webpack',
      {
        chainWebpack(config) {
          config
            .entry('index')
            .add('./src/global.js')
            .end();
        },
      },
    ],
  ],
};
