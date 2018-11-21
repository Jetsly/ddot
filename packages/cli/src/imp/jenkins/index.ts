import { Container, Interfaces, TYPES, utils } from '@ddot/plugin-utils';
import { request } from 'https';
import { createPromptModule } from 'inquirer';
import { exec } from 'shelljs';
import { error, Signale } from 'signale';

interface IArgv {
  jobName: string;
  branch: string;
}

export interface IJenkinsConfig {
  hostName: string;
  pathPrefix: string;
  prompt: (argv: IArgv) => [];
}

const COMMAND = 'jenkins';
const JENKINS_TOKEN = 'JENKINS_TOKEN';

@Container.injectable()
class JenkinsCommand implements Interfaces.Icli<IArgv> {
  public get config() {
    return Container.getCfg<IJenkinsConfig>(COMMAND);
  }
  public get command() {
    return `${COMMAND} [jobName]`;
  }
  public get describe() {
    return 'invoke a jenkins job for task';
  }
  public get builder() {
    return {
      branch: {
        type: 'string',
        default: exec("git status | head -n 1  | awk '{print  $3}'", {
          silent: true,
        }).stdout.trim(),
      },
    };
  }
  private get token() {
    return exec(`npm config get ${JENKINS_TOKEN}`, {
      silent: true,
    }).stdout.trim();
  }
  /**
   *
   * @param argv
   */
  public async handler(argv: IArgv) {
    if (this.token === 'undefined') {
      return error(`${JENKINS_TOKEN} not set, please npm config set `);
    }
    if (this.config === undefined) {
      return error(`${COMMAND} config not set, please set ${COMMAND} config `);
    }
    const { branch = '', jobName = '', ...answer } = {
      ...(await createPromptModule()(this.config.prompt(argv))),
      ...argv,
    };
    const scope = 'jenkins job';
    const stepFormat = `[%d/4]`;
    const interactive = new Signale({
      interactive: true,
      scope,
    });
    const { _ = ['jenkins'], $0 = '', ...params } = answer;
    try {
      interactive.await(`${stepFormat} - Get Next Job Id`, 1);
      const numb = await this.nextBuildNumber(jobName);
      interactive.await(`${stepFormat} - Invoke Job ID ${numb}`, 2);
      const data = await this.toExec(params, jobName);
      if (data) {
        throw new Error(data);
      }
      interactive.await(`${stepFormat} - Wait Job ID ${numb} Done`, 3);
      const status = await this.checkBuildStatus(jobName, numb);
      if (status) {
        interactive.success(`${stepFormat} - Job Done`, 4);
      } else {
        interactive.error(`${stepFormat} - Job fatal`, 4);
      }
    } catch (error) {
      interactive.fatal(error);
    }
  }
  /**
   *
   * @param jobName
   * @param buildNumber
   */
  protected async checkBuildStatus(jobName, buildNumber): Promise<boolean> {
    const path = `${jobName}/${buildNumber}/api/json?tree=result`;
    const now = Date.now();
    while (true) {
      const { result } = JSON.parse(await this.jenkisPost(path));
      if (result === 'FAILURE' || Date.now() - now > 1000 * 5 * 60) {
        return false;
      }
      await utils.delay(500);
      if (result === 'SUCCESS') {
        return true;
      }
    }
  }
  /**
   *
   * @param params
   * @param jobName
   */
  protected async toExec(params, jobName) {
    const path = `${jobName}/build`;
    const parameter = Object.keys(params).reduce(
      (preval, name) => [...preval, { name, value: params[name] }],
      []
    );
    return this.jenkisPost(path, { parameter });
  }
  /**
   *
   * @param jobName
   */
  protected async nextBuildNumber(jobName): Promise<string> {
    const path = `${jobName}/api/json?tree=nextBuildNumber`;
    return /(\d+)/.exec(await this.jenkisPost(path))[0];
  }
  /**
   *
   * @param data
   * @param path
   */
  protected async jenkisPost(path, data = {}) {
    return new Promise<string>((resolve, reject) => {
      const body = `json=${encodeURIComponent(JSON.stringify(data))}`;
      const req = request(
        {
          hostname: this.config.hostName,
          method: 'POST',
          auth: this.token,
          headers: {
            'Content-Length': Buffer.byteLength(body),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          path: `${this.config.pathPrefix}/${path}`,
        },
        res => {
          let rawData = '';
          res.setEncoding('utf8');
          res.on('data', chunk => (rawData += chunk));
          res.on('end', () => resolve(rawData));
        }
      );
      req.write(body);
      req.end();
    });
  }
}
Container.main.bind<Interfaces.Icli<any>>(TYPES.Icli).to(JenkinsCommand);
