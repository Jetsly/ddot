module.exports = {
  plugins: [
    '@ddot/ddot-plugin-react',
    [
      '@ddot/ddot-plugin-webpack',
      {
        chainWebpack(config, { webpack }) {
          config
            .entry('index')
            .add('src/index.js')
            .end();
        },
      },
    ],
  ],
};
