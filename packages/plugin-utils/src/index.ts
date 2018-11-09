import { Container } from 'inversify';
import 'reflect-metadata';
export { ContainerModule, injectable, inject } from 'inversify';

export * from './internal';
export * from './Identifier';
export * from './path';

export const ddotContainer = new Container();

export const pluginsCfg = pluginName => `CONFIG:${pluginName}`;
