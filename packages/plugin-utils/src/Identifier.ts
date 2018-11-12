// tslint:disable-next-line:no-namespace
export namespace Interfaces {
  export interface Icli<T> {
    /** command name */
    readonly command: string;
    /** command describe */
    readonly describe: string;
    /** command builder */
    readonly builder?: any;
    /** command handler */
    handler: (argv: T) => void;
  }

  export interface IProcess {
    next();
  }
}

export const TYPES = {
  Icli: Symbol('Icli'),
};
