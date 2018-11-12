import {
  CONFIG_KEYS,
  Container,
  Interfaces,
} from '@ddot/plugin-utils';
import webpack from 'webpack';
import * as Config from 'webpack-chain';
import * as webpackbar from 'webpackbar';
import { IConfig, pluginsName } from '../utils';

import * as Koa from 'koa';

interface IArgv {
  port: number;
}
@Container.injectable()
export default class BuildCommand implements Interfaces.Icli<IArgv> {
  @Container.inject(CONFIG_KEYS.PLUGIN_CFG_KEY(pluginsName))
  public config: IConfig;
  public get command() {
    return 'build';
  }
  public get describe() {
    return 'building for production';
  }
  private app;
  constructor() {
    this.app = new Koa();
  }
  public get builder() {
    return {};
  }
  public async handler(argv: IArgv) {
    const config = this.Config;
  }
  private get Config() {
    const config = new Config();
    config.plugin('progress').use(webpackbar);
    this.config.chainWebpack(config, { webpack });
    return config;
  }
}
