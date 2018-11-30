import { Container, Interfaces, utils } from '@ddot/plugin-utils';
import { ip } from 'address';
import * as Fastify from 'fastify';
import { createReadStream } from 'fs';
import { join } from 'path';
import { fatal } from 'signale';
import * as webpack from 'webpack';
import * as devMiddleware from 'webpack-dev-middleware';
import chainConfig from '../config';
import builddll from '../plugins/builddll';
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
    const fastify = Fastify();
    const cfgsetting = getCfgSetting();
    const config = chainConfig('development');
    if (cfgsetting.enableDll) {
      const { dllDir, ...dllreferOptons } = await builddll(config);
      config
        .plugin('dll-reference')
        .use(webpack.DllReferencePlugin, [dllreferOptons]);
      config.plugin('html-webpack').tap(() => [
        {
          template: join(__dirname, '../../tpl/document.dll.ejs'),
        },
      ]);
      fastify.get('/_dll/:path', (req, reply) => {
        if (/.js$/.test(req.params.path)) {
          reply.type('application/javascript; charset=UTF-8');
        }
        reply.send(createReadStream(join(dllDir, req.params.path), 'utf8'));
      });
    }
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
    if (cfgsetting.hot) {
      Object.keys(config.entryPoints.entries()).forEach(name => {
        config.entry(name).add('webpack-hot-middleware/client');
      });
    }
    const compiler = webpack(config.toConfig());
    const instance = devMiddleware(compiler, {
      logLevel: hasFriendError ? 'silent' : 'info',
    });
    fastify.use(instance);
    if (cfgsetting.hot) {
      fastify.use(
        require('webpack-hot-middleware')(compiler, {
          log: false,
        })
      );
    }
    fastify.setNotFoundHandler((request, reply) => {
      try {
        const filename = compiler.options.output.path + '/index.html';
        if (
          !/hot-update/i.test(request.req.url) &&
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
    fastify.get('/__ddot-plugin-server', (req, reply) => {
      reply.type('text/html');
      reply.res.write(
        '<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body>'
      );
      const outputPath = instance.getFilenameFromUrl(
        compiler.options.output.publicPath || '/'
      );
      const filesystem = instance.fileSystem;
      function writeDirectory(baseUrl, basePath) {
        const content = filesystem.readdirSync(basePath);
        reply.res.write('<ul>');
        content.forEach(item => {
          const p = `${basePath}/${item}`;
          if (filesystem.statSync(p).isFile()) {
            reply.res.write(`<li><a href="${baseUrl}${item}">${item}</a></li>`);
          } else {
            reply.res.write(`<li>${item}<br>`);
            writeDirectory(`${baseUrl + item}/`, p);
            reply.res.write('</li>');
          }
        });
        reply.res.write('</ul>');
      }
      writeDirectory(compiler.options.output.publicPath || '/', outputPath);
      reply.res.end('</body></html>');
    });
    cfgsetting.fastify(fastify);
    Object.keys(cfgsetting.proxy).forEach(prefix => {
      const { target, ...rest } = cfgsetting.proxy[prefix];
      fastify.register(require('fastify-http-proxy'), {
        upstream: target,
        prefix,
        rewritePrefix: prefix,
        ...rest,
      });
    });
    fastify.listen(port, '0.0.0.0', err => {
      if (err) {
        fatal(err);
      }
    });
  }
}
