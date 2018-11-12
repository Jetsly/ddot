import { Container } from 'inversify';
import 'reflect-metadata';
export { ContainerModule, injectable, inject } from 'inversify';

export * from './internal';
export * from './Identifier';
export * from './path';

export const ddotContainer = new Container();

/**
 * 延迟等待
 * @param time 毫秒数
 */
export const delay = time =>
  new Promise(resolve => setTimeout(() => resolve(), time));

export const CFG_KEY = pluginName => `CONFIG:KEY:${pluginName}`;
export const PLUGIN_CFG_KEY = pluginName => `CONFIG:PLUGIN:${pluginName}`;
