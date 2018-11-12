import {
  CONFIG_KEYS,
  Container,
  Interfaces,
  TYPES,
  utils,
} from '@ddot/plugin-utils';
import webpack from 'webpack';
import * as Config from 'webpack-chain';
import * as webpackbar from 'webpackbar';
import { IConfig, pluginsName } from '../utils';

import * as Koa from 'koa';
import webpackMiddle from 'webpack-dev-middleware';

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 8000;
interface IArgv {
  port: number;
}
@Container.injectable()
class DevCommand implements Interfaces.Icli<IArgv> {
  @Container.inject(CONFIG_KEYS.PLUGIN_CFG_KEY(pluginsName))
  public config: IConfig;
  public get command() {
    return 'dev';
  }
  public get describe() {
    return 'start a dev server for development';
  }
  private app;
  constructor() {
    this.app = new Koa();
  }
  public get builder() {
    return {
      port: {
        default: 8000,
      },
    };
  }
  public async handler(argv: IArgv) {
    const port = await utils.choosePort(argv.port);
    if (!port) {
      return;
    }
    this.app.listen(port);
    const config = this.Config;
  }
  private get Config() {
    const config = new Config();
    config.plugin('progress').use(webpackbar);
    this.config.chainWebpack(config, { webpack });
    return config;
  }
}
Container.main.bind<Interfaces.Icli<any>>(TYPES.Icli).to(DevCommand);
