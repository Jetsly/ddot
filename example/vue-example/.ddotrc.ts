export default {
  plugins: [
    [
      'jenkins',
      {
        hostName: 'jenkins.mundhana.com',
        pathPrefix: '/job/mundhana/job',
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
  ],
};
