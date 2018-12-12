import chalk from 'chalk';
import * as cluster from 'cluster';
import { warn } from 'signale';
import * as parse from 'yargs-parser';
import './_register';
import { checkPluginExsit } from './check';
import * as config from './config';
import { loadCfg, showHelp } from './utils';

const { _, ...argv } = parse(process.argv.slice(2));
const cliProxy = {
  ...config,
  argv,
  cmd: new Proxy(
    {},
    {
      get(target, propKey) {
        if (target[propKey] === undefined) {
          Reflect.set(target, propKey, {});
        }
        return target[propKey];
      },
    }
  ),
};
const cfg = loadCfg();
cfg.plugins.forEach(plugin => {
  const [moduleId, value] = Array.isArray(plugin) ? plugin : [plugin, {}];
  const moduleFunc = checkPluginExsit(moduleId, cluster.isMaster);
  (Array.isArray(moduleFunc) ? moduleFunc : [moduleFunc]).forEach(func => {
    func(cliProxy, value);
  });
});
const { cmd } = cliProxy;
const name = _[0];
if (cluster.isMaster) {
  if (_.length === 0) {
    showHelp(cmd);
  } else if (cmd[name]) {
    // cluster.fork();
    cmd[name].apply()
  } else {
    warn(`Command ${chalk.cyan(name)} does not exists`);
  }
} else {
  // Promise.resolve(0)
  //   .then(() => cmd[name].apply())
    // .then(() => cluster.worker.destroy('1'));
}
