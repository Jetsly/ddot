import { readFileSync } from 'fs';
import * as Config from 'webpack-chain';
import { gzipSync } from 'zlib';

const DEFAULT_BROWSERS = [
  '>1%',
  'last 4 versions',
  'Firefox ESR',
  'not ie < 9',
];

export interface ICFG {
  title: string;
  outFileName: string;
  outputPath: string;
  chainWebpack: (config: Config) => void;
  hot: boolean;
  sourceMap: boolean;
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
  lessLoaderOptions: {};
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
    hot: true,
    sourceMap: false,
    tsImportOption: [],
    extraPostCSSPlugins: [],
    lessLoaderOptions: {},
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
