import { ddotContainer, ICli, injectable, TYPES } from '@ddot/plugin-utils';
import * as cosmiconfig from 'cosmiconfig';
import * as resolveCwd from 'resolve-cwd';

const moudleName = 'ddot';
const explorer = cosmiconfig(moudleName);
const result: {
  config: { 
    plugins: string[];
  };
} = explorer.searchSync();
result.config.plugins.forEach(plugin => {
  resolveCwd(plugin);
});
ddotContainer.getAll<ICli>(TYPES.ICli).forEach(cli => cli.run());
