import { join } from 'path';
export default {
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
          config: join(__dirname, './src/config'),
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
