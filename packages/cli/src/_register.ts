import { fatal } from 'signale';
import { resolveCwd, tsExt } from './utils';

const registerTs = () => {
  const old = require.extensions[tsExt] || require.extensions['.js'];
  require.extensions[tsExt] = (m: any, filename: string) => {
    const ts = resolveCwd(`typescript`);
    if (ts === null) {
      fatal(new Error('Not found typescript module'));
    }
    const _compile = m._compile;
    m._compile = function(code: string, fileName: string) {
      const result = require(ts).transpileModule(code, {
        filename,
        reportDiagnostics: true,
      });
      return _compile.call(this, result.outputText, fileName);
    };
    return old(m, filename);
  };
};
registerTs();
