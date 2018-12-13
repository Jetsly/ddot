import * as cliui from 'cliui';
import { warn } from 'signale';
import { esModule, getModulePaths, resolveCwd } from './utils';

export function checkPluginExsit(moduleId, isMaster) {
  const modulePaths = getModulePaths({ moduleId });

  const modules = modulePaths.map(id => resolveCwd(id)).filter(has => has);
  if (modules.length) {
    return esModule(require(modules[0]));
  } else if (isMaster) {
    warn(`not found plugin id: ${moduleId}, paths in:`);
    const ui = cliui();
    modulePaths.forEach((path, idx) => {
      ui.div({
        text: `${idx === modulePaths.length - 1 ? '└──' : '├──'}${path}`,
        padding: [0, 0, 0, 5],
      });
    });
    process.stdout.write(`${ui.toString()}\n`);
  }
}
