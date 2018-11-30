import { CONFIG_KEYS } from '../Identifier';

const pluginName = 'utils';
test('CONFIG_KEYS CFG_KEY', () => {
  expect(CONFIG_KEYS.CFG_KEY(pluginName)).toBe(`CONFIG:KEY:${pluginName}`);
});
test('CONFIG_KEYS PLUGIN_CFG_KEY', () => {
  expect(CONFIG_KEYS.PLUGIN_CFG_KEY(pluginName)).toBe(`CONFIG:PLUGIN:${pluginName}`);
});
