import "reflect-metadata";
import { Container } from 'inversify';
export { ContainerModule, injectable, inject } from 'inversify';
export * from './interfaces';
export * from './types';

export const ddotContainer = new Container();
