import {
  ddotContainer,
  injectable,
  Interfaces,
  TYPES,
} from '@ddot/plugin-utils';
// import Koa from 'koa';
// import webpackMiddle from 'webpack-dev-middleware';

// const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 8000;

@injectable()
class DevCommand implements Interfaces.Icli {
  public get command() {
    return ['dev', 'start a dev server for development'];
  }
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
ddotContainer
  .bind<Interfaces.Icli>(TYPES.Icli)
  .to(DevCommand)
  .whenTargetNamed('dev');
