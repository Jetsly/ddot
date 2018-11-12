 ## ddot-cli
 
#### .ddotrc.js

```js
 jenkins: {
    hostName,
    pathPrefix,
    prompt: ({ branch, jobName }) => [
      {
        type: 'list',
        name: 'Project',
        message: 'choose project?',
        choices: () => [''],
      },
      {
        type: 'list',
        name: 'Branch',
        message: 'choose branch?',
        choices: () => [
          branch,
          ...['develop', 'master'].filter(b => b !== branch),
        ],
      },
      {
        type: 'confirm',
        name: 'ok',
        message: answers =>
          `Job Name [${jobName}], Project [${answers.Project}], Branch [${
            answers.Branch
          }]`,
        default: false,
      },
    ],
  },
```