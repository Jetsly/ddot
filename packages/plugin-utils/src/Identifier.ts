// tslint:disable-next-line:no-namespace
export namespace Interfaces {
  export interface Icli {
    /** command name */
    readonly command: string;
    /** command describe */
    readonly describe: string;
    /** command handler */
    handler: (argv: object) => void;
  }

  export interface IProcess {
    next();
  }
}

export const TYPES = {
  Icli: Symbol('Icli'),
};
