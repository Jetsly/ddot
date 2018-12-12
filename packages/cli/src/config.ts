import { join } from 'path';

export const path = {
  /** root path */
  get cwd() {
    return process.cwd();
  },
  get absSrcPath() {
    return join(this.cwd, 'src');
  },
  get absTmpDirPath() {
    return join(this.absSrcPath, '.ddot');
  },
  get absPagesPath() {
    return join(this.absSrcPath, 'pages');
  },
};
