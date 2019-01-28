import { utils } from '@ddot/plugin-utils';
import { ip } from 'address';
import * as compress from 'compression';
import * as historyApiFallback from 'connect-history-api-fallback';
import * as express from 'express';
import * as httpProxyMiddleware from 'http-proxy-middleware';
import { fatal } from 'signale';
import * as webpack from 'webpack';
import * as devMiddleware from 'webpack-dev-middleware';
import chainConfig from '../config';
import { getCfgSetting } from '../utils';

const command = 'dev';
const serverFiles = ({ instance, outputPath, prefixPath }) => (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write('<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body>');
  const filesystem = instance.fileSystem;
  function writeDirectory(baseUrl, basePath) {
    const content = filesystem.readdirSync(basePath);
    res.write('<ul>');
    content.forEach(item => {
      const p = `${basePath}/${item}`;
      if (filesystem.statSync(p).isFile()) {
        res.write('<li><a href="');
        res.write(baseUrl + item);
        res.write('">');
        res.write(item);
        res.write('</a></li>');
      } else {
        res.write('<li>');
        res.write(item);
        res.write('<br>');
        writeDirectory(`${baseUrl + item}/`, p);
        res.write('</li>');
      }
    });

    res.write('</ul>');
  }
  writeDirectory(`${prefixPath}/`, outputPath);
  res.end('</body></html>');
};
export default function create(api, opt) {
  api.cmd[command].describe = 'start a dev server for development';
  api.cmd[command].apply = async () => {
    const port = await utils.choosePort(api.argv.port || 8000);
    if (!port) {
      return;
    }
    const setting = getCfgSetting(opt);
    const app = new express();
    const config = chainConfig('development', setting, {
      path: api.path,
    });
    const hasFriendError = config.plugins.has('friendly-errors');
    if (hasFriendError) {
      config.plugin('friendly-errors').tap(args => [
        {
          ...args[0],
          compilationSuccessInfo: {
            messages: [
              [
                `App running at:`,
                `  - Local:    http://localhost:${port}`,
                `  - Network:  http://${ip()}:${port}`,
              ].join('\n'),
            ],
          },
        },
      ]);
    }
    if (setting.hot) {
      Object.keys(config.entryPoints.entries()).forEach(name => {
        config.entry(name).add('webpack-hot-middleware/client');
      });
    }
    const compiler = webpack(config.toConfig());
    const publicPath = compiler.options.output.publicPath;
    const instance = devMiddleware(compiler, {
      publicPath,
      logLevel: hasFriendError ? 'silent' : 'info',
    });
    const prefixPath = publicPath.replace(/\/+$/,'');
    const outputPath = instance.getFilenameFromUrl(publicPath);
    app.use(compress());
    Object.keys(setting.proxy).forEach(prefix => {
      const { target, ...rest } = setting.proxy[prefix];
      app.use(
        prefix,
        httpProxyMiddleware(prefix, { target, changeOrigin: true, ...rest })
      );
    });
    app.use(
      historyApiFallback({
        index: `${prefixPath}/index.html`,
      })
    );
    app.use(instance);
    app.use(require('webpack-hot-middleware')(compiler));
    app.get(
      '/__webpack_files',
      serverFiles({ instance, prefixPath, outputPath })
    );
    app.listen(port, '0.0.0.0', err => {
      if (err) {
        fatal(err);
      }
    });
  };
}
