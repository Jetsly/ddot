import { CONFIG_KEYS, Container, Interfaces, utils } from '@ddot/plugin-utils';
import webpack from 'webpack';
import { chainConfig, IConfig, pluginsName } from '../utils';

import * as Koa from 'koa';
import webpackMiddle from 'webpack-dev-middleware';

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 8000;
interface IArgv {
  port: number;
}
@Container.injectable()
export default class DevCommand implements Interfaces.Icli<IArgv> {
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
    const config = this.Config;
    console.log(config.toConfig());
  }
  private get Config() {
    const config = chainConfig();
    this.config.chainWebpack(config, { webpack });
    return config;
  }
}
