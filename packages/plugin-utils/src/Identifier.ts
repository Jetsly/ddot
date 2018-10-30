// tslint:disable-next-line:no-namespace
export namespace Interfaces {
  export interface Icli {
    command: string[];
    run(): void;
  }
}

export const TYPES = {
  Icli: Symbol.for('Icli'),
};
