import { Container } from '@ddot/plugin-utils';
import { readFileSync } from 'fs';
import * as Config from 'webpack-chain';
import { gzipSync } from 'zlib';

// tslint:disable-next-line:no-var-requires
export type setConfig = (config: Config) => void;
export const pluginsName = 'webpack';
export const isInteractive = process.stdout.isTTY;
export function addCfgSetting(config) {
  const cfg = Container.getCfg<{
    chainWebpack: (config: Config) => void;
  }>(pluginsName);
  if (cfg) {
    cfg.chainWebpack(config);
  }
}
export function gzipSize(filePath: string) {
  return gzipSync(readFileSync(filePath)).length;
}
