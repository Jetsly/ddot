import { join } from 'path';
export default {
  plugins: [
    './test-plugin',
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
        tsLoaderOption: {
          transformers: {
            before: [require('ts-react-hot-transformer')],
          },
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
