import * as cliui from 'cliui';
import { warn } from 'signale';
import { esModule, getModulePaths, resolveCwd } from './utils';

export function checkPluginExsit(moduleId, isMaster) {
  const modules = getModulePaths({ moduleId })
    .map(id => resolveCwd(id))
    .filter(has => has);
  if (modules.length) {
    return esModule(require(modules[0]));
  } else if (isMaster) {
    warn(`not found plugin id: ${moduleId}, paths in:`);
    const ui = cliui();
    const paths = getModulePaths({ moduleId });
    paths.forEach((path, idx) => {
      ui.div({
        text: `${idx === paths.length - 1 ? '└──' : '├──'}${path}`,
        padding: [0, 0, 0, 5],
      });
    });
    process.stdout.write(`${ui.toString()}\n`);
  }
}
