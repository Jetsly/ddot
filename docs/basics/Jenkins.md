# Jenkins
`jenkins` is default plugins, don't need install, if to enable need to add options

* must store `JENKINS_TOKEN = "user:token"` in `npmrc`

## run

```js
$ yarn ddot jenkins [jobName] // to exec reomote job
```

## options

```ts
export default {
  plugins: [
    [
      'jenkins',{...},
    ],
  ],
};

```

#### hostName
remote jenkins server hostName

such as:
```js
hostName: 'h5.jenkins.com'
```

#### pathPrefix
remote jenkins server job pathPrefix

such as:
```js
pathPrefix: '/job/view'
```

#### prompt

return [`Question Object`](https://github.com/SBoudrias/Inquirer.js/#objects) list to choose params 

such as:
```js
prompt: ({ branch, jobName }) => [
  {
    type: 'input',
    name: 'jobName',
    messages: 'jobName',
    default: 'deploy-project',
  },
  {
    type: 'list',
    name: 'branch',
    messages: 'which branch to deploy',
    choices: () => [branch, 'master', 'develop'],
  },
],
// to exec jobName[deploy-project] will add params branch
```

