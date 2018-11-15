import { Container, Interfaces, utils } from '@ddot/plugin-utils';
import { ip } from 'address';
import * as Fastify from 'fastify';
import { fatal } from 'signale';
import { PassThrough } from 'stream';
import * as webpack from 'webpack';
import * as devMiddleware from 'webpack-dev-middleware';
import { createGzip } from 'zlib';
import chainConfig from '../config';
import { getCfgSetting } from '../utils';

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
    const fastify = Fastify();
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
    Object.keys(config.entryPoints.entries()).forEach(name => {
      config.entry(name).add('webpack-hot-middleware/client');
    });
    const compiler = webpack(config.toConfig());
    const instance = devMiddleware(compiler, {
      logLevel: hasFriendError ? 'silent' : 'info',
    });
    fastify.use(instance);
    fastify.use(
      require('webpack-hot-middleware')(compiler, {
        log: false,
      })
    );
    fastify.setNotFoundHandler((request, reply) => {
      try {
        const filename = compiler.options.output.path + '/index.html';
        if (
          /get/i.test(request.req.method) &&
          ['text/html', '*/*'].filter(
            type => request.headers.accept.indexOf(type) > -1
          ).length &&
          instance.fileSystem.statSync(filename).isFile()
        ) {
          reply
            .type('text/html')
            .send(instance.fileSystem.readFileSync(filename));
        } else {
          reply.code(404).send(new Error('Not Found'));
        }
      } catch (e) {
        reply.code(404).send(new Error('Not Found'));
      }
    });
    getCfgSetting().fastify(fastify);
    fastify.listen(port, '0.0.0.0', err => {
      if (err) {
        fatal(err);
      }
    });
  }
}
