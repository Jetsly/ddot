import { utils } from '@ddot/plugin-utils';
import { ip } from 'address';
import * as Fastify from 'fastify';
import { fatal } from 'signale';
import * as webpack from 'webpack';
import * as devMiddleware from 'webpack-dev-middleware';
import chainConfig from '../config';
import { getCfgSetting } from '../utils';

const command = 'dev'; 
export default function create(api, opt) {
  api.cmd[command].describe = 'start a dev server for development';
  api.cmd[command].apply = async () => {
    const port = await utils.choosePort(api.argv.port || 8000);
    if (!port) {
      return;
    }
    const setting = getCfgSetting(opt)
    const fastify = Fastify();
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
    const instance = devMiddleware(compiler, {
      logLevel: hasFriendError ? 'silent' : 'info',
    });
    fastify.use(instance);
    if (setting.hot) {
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
    setting.fastify(fastify);
    Object.keys(setting.proxy).forEach(prefix => {
      const { target, ...rest } = setting.proxy[prefix];
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
  };
}
