import chalk from 'chalk';
import * as cliui from 'cliui';
import * as filesize from 'filesize';
import { basename, dirname, join } from 'path';
import { fatal } from 'signale';
import * as webpack from 'webpack';
import chainConfig from '../config';
import { fileLength, getCfgSetting, gzipSize } from '../utils';
function canReadAsset(asset) {
  return (
    /\.(js|css|html|png|jpe?g|gif)$/.test(asset) &&
    !/service-worker\.js/.test(asset) &&
    !/precache-manifest\.[0-9a-f]+\.js/.test(asset)
  );
}
const command = 'build';
export default function create(api, opt) {
  api.cmd[command].describe = 'building for production';
  api.cmd[command].apply = async () => {
    const setting = getCfgSetting(opt);
    const config = chainConfig('production', setting, {
      path: api.path,
    });
    const compiler = webpack(config.toConfig());
    compiler.run((err, webpackStats) => {
      if (err) {
        fatal(err);
      }
      const buildFolder = compiler.options.output.path;
      const assets: Array<{
        folder: string;
        name: string;
        originSize: string;
        compressSize: string;
      }> = webpackStats
        .toJson({ all: false, assets: true })
        .assets.filter(asset => canReadAsset(asset.name))
        .map(asset => {
          return {
            folder: join(basename(buildFolder), dirname(asset.name)),
            name: basename(asset.name),
            originSize: filesize(fileLength(join(buildFolder, asset.name))),
            compressSize: filesize(gzipSize(join(buildFolder, asset.name))),
          };
        });
      if (assets.length) {
        const ui = cliui();
        ui.div({
          text: 'File sizes after gzip:',
          padding: [0, 0, 1, 2],
        });
        assets.forEach(({ originSize, compressSize, folder, name }) => {
          ui.div(
            {
              text: `${originSize} ${chalk.green(`==>`)} ${compressSize}`,
              width: 30,
              padding: [0, 0, 0, 4],
            },
            {
              text: `${folder}/${chalk.blue(name)}`,
            }
          );
        });
        process.stdout.write(`${ui.toString()}\n`);
        process.stdout.write(`\n`);
      }
    });
  };
}
