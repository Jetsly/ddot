# How to use

First, let's install @ddot/ddot-cli 

Then, export default a function


`test-plugin`

```ts
export default function create(api,opt){
  // command name
  const command = '';
  //command describe
  api.cmd[command].describe = 'describe'

  api.cmd[command].apply= function(){
    //do something...
  }
}

```

Then, config .ddotrc.ts file

`.ddotrc.ts`

```ts
export default {
  plugins: ['./test-plugin']
}
```

Last, run command

```shell
$ ddot
```