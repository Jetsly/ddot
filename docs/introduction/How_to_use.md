# How to use

First, let's install @ddot/ddot-cli 

Then, implements Interfaces.Icli

Last, bind in Container


`test-plugin`

```js
import {
  Container,
  Interfaces,
  TYPES,
  utils,
} from '@ddot/plugin-utils';
interface IArgv {
  test: string;
}
@Container.injectable()
class JenkinsCommand implements Interfaces.Icli<IArgv> {
  public get command() {
    // return command name
  }
  public get describe() {
    // return command describe
  }
  public async handler(argv: IArgv) {
    // do something...
  }
}
Container.main.bind<Interfaces.Icli<any>>(TYPES.Icli).to(JenkinsCommand);

```

Then, config .ddotrc.js file

`.ddotrc.js`

```js
module.exports = {
  plugins: ['./test-plugin`']
}
```