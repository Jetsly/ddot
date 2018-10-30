import { choosePort } from '@ddot/plugin-utils';
// import Koa from 'koa';
// import webpackMiddle from 'webpack-dev-middleware';

// const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 8000;

class DevCommand {
  // protected app: any;
  constructor() {
    // this.app = new Koa();
  }
  public async run() {
    // const port = await choosePort(DEFAULT_PORT);
    // this.app.listen(3000);
    console.log('DevCommand');
  }
}
