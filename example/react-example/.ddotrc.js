const path = require('path');
module.exports = {
  plugins: [
    'react',
    [
      'webpack',
      {
        proxy: {
          '/todos/1': {
            target: 'http://jsonplaceholder.typicode.com/',
          },
        },
        alias: {
          config: path.join(__dirname, './src/config'),
        },
        define: {
          c: { a: 'c' },
        },
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
