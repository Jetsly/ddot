import { choosePort } from './choosePort';
import clearConsole from './clearConsole';
/**
 * 延迟等待
 * @param time 毫秒数
 */
const delay = time => new Promise(resolve => setTimeout(() => resolve(), time));

export const utils = {
  clearConsole,
  choosePort,
  delay,
};
