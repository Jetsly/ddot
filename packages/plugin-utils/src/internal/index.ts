import { choosePort } from './choosePort';
import clearConsole from './clearConsole';
/**
 * 延迟等待
 * @param time 毫秒数
 */
const delay = time => new Promise(resolve => setTimeout(() => resolve(), time));

/**
 * 合并配置
 * @param origin 原始
 * @param append 追加
 */
export function mergeOptions(origin, append) {
  return Object.keys(append).reduce(
    (opts, key) => {
      const originValue = opts[key];
      if (originValue === undefined) {
        return { ...opts, [key]: append[key] };
      } else if (Array.isArray(originValue)) {
        return { ...opts, [key]: originValue.concat(append[key]) };
      } else if (typeof originValue === 'function') {
        return {
          ...opts,
          [key]: (...rest) => {
            originValue(...rest);
            append[key](...rest);
          },
        };
      } else {
        return {
          ...opts,
          [key]: mergeOptions(originValue, append[key]),
        };
      }
    },
    { ...origin }
  );
}

export const utils = {
  clearConsole,
  choosePort,
  delay,
};
