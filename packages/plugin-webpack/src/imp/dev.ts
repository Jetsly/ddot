import { Container, Interfaces, utils } from '@ddot/plugin-utils';
import { ip } from 'address';
import { fatal } from 'signale';
import * as webpack from 'webpack';
import * as devMiddleware from 'webpack-dev-middleware';
import { chainConfig } from '../utils';

interface IArgv {
  port: number;
}
@Container.injectable()
export default class DevCommand implements Interfaces.Icli<IArgv> {
  public get command() {
    return 'dev';
  }
  public get describe() {
    return 'start a dev server for development';
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
    const config = chainConfig('development');
    const fastify = require('fastify')();
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
    const compiler = webpack(config.toConfig());
    const instance = devMiddleware(compiler, {
      logLevel: 'silent',
    });
    fastify.use(instance);
    // fastify.use(require('webpack-hot-middleware')(compiler));
    fastify.listen(port, '0.0.0.0', (err) => {
      if (err) {
        fatal(err);
      }
    });
  }
}
