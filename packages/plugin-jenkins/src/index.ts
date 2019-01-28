import { createPromptModule } from 'inquirer';
import { Signale } from 'signale';
import { checkConfig } from './check';
import { checkBuildStatus, jenkisPost, nextBuildNumber, toExec } from './post';

const command = 'jenkins';
const scope = 'jenkins job';
const stepFormat = `[%d/4]`;
const describe = 'invoke a jenkins job for task';

export default async function createCommand(api, opts) {
  api.cmd[command].describe = describe;
  api.cmd[command].apply = async () => {
    const [token, defaultBranch] = checkConfig(opts);
    opts.mapValue = opts.mapValue || (val => val);
    const data = {
      branch: defaultBranch,
    };
    const { branch = '', jobName = '', ...answer } = {
      ...data,
      ...(await createPromptModule()(opts.prompt(data))),
    };
    const post = jenkisPost.bind(this, { opts, token });

    const interactive = new Signale({
      interactive: true,
      scope,
    });
    try {
      interactive.await(`${stepFormat} - Get Next Job Id`, 1);
      const numb = await nextBuildNumber(post, jobName);
      interactive.await(`${stepFormat} - Invoke Job ID ${numb}`, 2);
      const err = await toExec(post, opts.mapValue(answer), jobName);
      if (err) {
        throw new Error(err);
      }
      interactive.await(`${stepFormat} - Wait Job ID ${numb} Done`, 3);
      const status = await checkBuildStatus(
        post,
        jobName,
        numb,
        opts.showConsoleText || true
      );
      if (status) {
        interactive.success(`${stepFormat} - Job Done`, 4);
      } else {
        interactive.error(`${stepFormat} - Job fatal`, 4);
      }
    } catch (error) {
      interactive.fatal(error);
    }
  };
}
