import {
  Container as MainContainer,
  ContainerModule,
  inject,
  injectable,
} from 'inversify';
import 'reflect-metadata';

export * from './internal';
export * from './Identifier';
export * from './path';

import { CONFIG_KEYS } from './Identifier';

const main = new MainContainer();

export const Container = {
  main,
  ContainerModule,
  injectable,
  inject,
  getCfg<T>(pluginName: string): T {
    const serviceIdentifier = CONFIG_KEYS.PLUGIN_CFG_KEY(pluginName).trim();
    if (main.isBound(serviceIdentifier)) {
      return main.get<T>(serviceIdentifier);
    }
    return undefined;
  },
};

export default Container;
