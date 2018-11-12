import { Container, Interfaces, TYPES } from '@ddot/plugin-utils';
import BuildCommand from './imp/build';
import DevCommand from './imp/dev';

Container.main.bind<Interfaces.Icli<any>>(TYPES.Icli).to(DevCommand);
Container.main.bind<Interfaces.Icli<any>>(TYPES.Icli).to(BuildCommand);
