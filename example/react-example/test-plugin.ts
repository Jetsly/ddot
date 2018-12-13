export default function create(api, opt) {
  // command name
  const command = '333';
  // command describe
  api.cmd[command].describe = 'describe';

  api.cmd[command].apply = function apply() {
    console.log('hello world');
  };
}
