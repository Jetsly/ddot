import { join } from 'path';
export default {
  plugins: [
    [
      'jenkins',
      {
        hostName: 'jenkins.hello.com',
        pathPrefix: '/job/job',
        prompt: ({ branch, jobName }) => [
          {
            type: 'input',
            name: 'jobName',
            messages: 'jobName',
            default: 'console-flow-pipeline',
          },
          {
            type: 'list',
            name: 'Project',
            messages: 'which project to deploy',
            choices: () => ['portal-admin', 'lender-admin'],
          },
          {
            type: 'list',
            name: 'Branch',
            messages: 'which branch to deploy',
            choices: () => [branch, 'develop', 'master'],
          },
          {
            type: 'list',
            name: 'Env',
            messages: 'which Env to deploy',
            choices: () => ['develop', 'release'],
          },
        ],
      },
    ],
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
