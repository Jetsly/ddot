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
}

export const TYPES = {
  Icli: Symbol('Icli'),
};

export const CONFIG_KEYS = {
  CFG_KEY: pluginName => `CONFIG:KEY:${pluginName}`,
  PLUGIN_CFG_KEY: pluginName => `CONFIG:PLUGIN:${pluginName}`,
};
