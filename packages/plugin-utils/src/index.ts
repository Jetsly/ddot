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

const main = new MainContainer();

export const Container = {
  main,
  ContainerModule,
  injectable,
  inject,
};

export default Container;
