import {
  ddotContainer,
  injectable,
  Interfaces,
  TYPES,
} from '@ddot/plugin-utils';
import webpack from 'webpack';
import * as Config from 'webpack-chain';
import * as webpackbar from 'webpackbar'
import { cfg } from '../utils';

import * as Koa from 'koa';
import webpackMiddle from 'webpack-dev-middleware';

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 8000;

@injectable()
class DevCommand implements Interfaces.Icli {
  public get command() {
    return 'dev';
  }
  public get describe() {
    return 'start a dev server for development';
  }
  private app
  constructor() {
    this.app = new Koa();
  }
  public async handler(argv: object) {
    // const port = await choosePort(DEFAULT_PORT);
    // this.app.listen(3000);
    const config = this.Config
    console.log(config.toConfig());
  }
  private get Config(){
    const config = new Config();
    config.plugin('progress').use(webpackbar)
    cfg.info.chainWebpack(config, { webpack });
    
    return config
  }
}
ddotContainer.bind<Interfaces.Icli>(TYPES.Icli).to(DevCommand);
