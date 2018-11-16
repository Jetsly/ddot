import { Container, Interfaces } from '@ddot/plugin-utils';
import chalk from 'chalk';
import * as cliui from 'cliui';
import * as filesize from 'filesize';
import { basename, dirname, join } from 'path';
import { fatal } from 'signale';
import * as webpack from 'webpack';
import chainConfig from '../config';
import { gzipSize } from '../utils';

function canReadAsset(asset) {
  return (
    /\.(js|css|html)$/.test(asset) &&
    !/service-worker\.js/.test(asset) &&
    !/precache-manifest\.[0-9a-f]+\.js/.test(asset)
  );
}

@Container.injectable()
export default class BuildCommand implements Interfaces.Icli<{}> {
  public get command() {
    return 'build';
  }
  public get describe() {
    return 'building for production';
  }
  public async handler() {
    const config = chainConfig('production');

    const compiler = webpack(config.toConfig());
    compiler.run((err, webpackStats) => {
      if (err) {
        fatal(err);
      }
      const buildFolder = compiler.options.output.path;
      const assets: Array<{
        folder: string;
        name: string;
        size: string;
      }> = webpackStats
        .toJson({ all: false, assets: true })
        .assets.filter(asset => canReadAsset(asset.name))
        .map(asset => {
          return {
            folder: join(basename(buildFolder), dirname(asset.name)),
            name: basename(asset.name),
            size: filesize(gzipSize(join(buildFolder, asset.name))),
          };
        });
      if (assets.length) {
        const ui = cliui();
        ui.div({
          text: 'File sizes after gzip:',
          padding: [0, 0, 1, 2],
        });
        assets.forEach(({ size, folder, name }) => {
          ui.div(
            {
              text: size,
              width: 15,
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
  }
}
