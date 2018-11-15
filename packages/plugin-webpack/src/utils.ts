import { Container } from '@ddot/plugin-utils';
import * as fastify from 'fastify';
import { readFileSync } from 'fs';
import * as Config from 'webpack-chain';
import { gzipSync } from 'zlib';

const DEFAULT_BROWSERS = [
  '>1%',
  'last 4 versions',
  'Firefox ESR',
  'not ie < 9',
];
const DEFAULT_TS_IMPORT_OPTION = [
  {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  },
];

export interface ICFG {
  chainWebpack: (config: Config) => void;
  fastify: (server: fastify.FastifyInstance) => void;
  tsImportOption: () => [];
  browserlist: () => [];
}
// tslint:disable-next-line:no-var-requires
export type setConfig = (config: Config) => void;
export const pluginsName = 'webpack';
export const isInteractive = process.stdout.isTTY;
export function getCfgSetting() {
  const cfg = Container.getCfg<ICFG>(pluginsName) || {};
  return {
    // tslint:disable-next-line:no-empty
    chainWebpack(config) {},
    // tslint:disable-next-line:no-empty
    fastify(server) {},
    tsImportOption() {
      return DEFAULT_TS_IMPORT_OPTION;
    },
    browserlist() {
      return DEFAULT_BROWSERS;
    },
    ...cfg,
  };
}
export function gzipSize(filePath: string) {
  return gzipSync(readFileSync(filePath)).length;
}
