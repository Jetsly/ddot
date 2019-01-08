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
// const DEFAULT_TS_IMPORT_OPTION = [
//   {
//     libraryName: 'antd',
//     libraryDirectory: 'es',
//     style: true,
//   },
// ];
export interface ICFG {
  title: string;
  outFileName: string;
  outputPath: string;
  chainWebpack: (config: Config) => void;
  fastify: (server: fastify.FastifyInstance) => void;
  hot: boolean;
  tsImportOption: Array<{
    libraryName: string;
    libraryDirectory: string;
    style: string | boolean;
  }>;
  tsLoaderOption: {
    transformers: {
      before: [];
      after: [];
    };
  };
  browserlist: string[];
  extraPostCSSPlugins: [];
  alias: { [key: string]: string };
  define: { [key: string]: string };
  proxy: {
    [key: string]: {
      target: string;
    };
  };
}
// tslint:disable-next-line:no-var-requires
export type setConfig = (config: Config) => void;
export const isInteractive = process.stdout.isTTY;
export function fileLength(filePath: string) {
  return readFileSync(filePath).length;
}
export function gzipSize(filePath: string) {
  return gzipSync(readFileSync(filePath)).length;
}
export function getCfgSetting(opt): ICFG {
  const cfg = opt || {
    tsLoaderOption: {
      transformers: {
        before: [],
        after: [],
      },
    },
  };
  return {
    title: 'DDot App',
    outputPath: './dist',
    // tslint:disable-next-line:no-empty
    chainWebpack(config) {},
    // tslint:disable-next-line:no-empty
    fastify(server) {},
    hot: true,
    enableDll: false,
    dll: {},
    tsImportOption: [],
    extraPostCSSPlugins: [],
    browserlist: DEFAULT_BROWSERS,
    alias: {},
    define: {},
    proxy: {},
    ...cfg,
    tsLoaderOption: {
      transformers: {
        before: [],
        after: [],
      },
      ...(cfg.tsLoaderOption || {}),
    },
  };
}
