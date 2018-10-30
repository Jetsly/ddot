import { Container } from 'inversify';
import 'reflect-metadata';
export { ContainerModule, injectable, inject } from 'inversify';

export { choosePort } from './internal/choosePort';

export * from './Identifier';

export const ddotContainer = new Container();
