import { path } from '@ddot/plugin-utils';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as rimraf from 'rimraf';
import { error, info, success } from 'signale';
import * as webpack from 'webpack';
import * as Config from 'webpack-chain';
import { dllName, getCfgSetting } from '../utils';

export default (config: Config) =>
  new Promise<{ dllDir: string; manifest: string; context: string }>(
    (resolve, reject) => {
      const cfgsetting = getCfgSetting();
      const dllConfig = new Config();
      dllConfig.merge(config.toConfig());
      const dllDir = `${path.absTmpDirPath}/dll.${dllConfig.get('mode')}`;
      const filesInfoFile = join(dllDir, 'filesInfo.json');
      const dependencies = Object.keys(cfgsetting.dll).length
        ? cfgsetting.dll
        : require(process.cwd() + '/package.json').dependencies;
      const filesInfo = JSON.stringify(dependencies, null, '\t');
      const dllreferOptons = {
        dllDir,
        manifest: join(dllDir, `${dllName}.json`),
        context: path.absSrcPath,
      };
      const { manifest, ...dllOptons } = dllreferOptons;

      if (existsSync(filesInfoFile)) {
        if (readFileSync(filesInfoFile, 'utf-8') === filesInfo) {
          info(
            `[ddot-plugin-dll] File list is equal, don't generate the dll file.`
          );
          return resolve(dllreferOptons);
        }
      }
      // del dir
      rimraf.sync(dllDir);
      dllConfig.plugins.delete('html-webpack');
      dllConfig.optimization.clear();
      dllConfig.entryPoints.clear();
      Object.keys(dependencies)
        .reduce(
          (entry, devName) => entry.add(devName),
          dllConfig.entry(dllName)
        )
        .end();
      dllConfig.output
        .path(dllDir)
        .filename(`[name].dll.js`)
        .library('[name]');

      dllConfig.plugin('dll').use(webpack.DllPlugin, [
        {
          name: '[name]',
          path: dllreferOptons.manifest,
          ...dllOptons,
        },
      ]);

      webpack(dllConfig.toConfig()).run((err, webpackStats) => {
        if (err) {
          error('[dot-plugin-dll] Build dll error', err);
          reject(err);
        } else {
          writeFileSync(filesInfoFile, filesInfo, 'utf-8');
          success('[dot-plugin-dll] Build dll done');
          // to log file
          resolve(dllreferOptons);
        }
      });
    }
  );
