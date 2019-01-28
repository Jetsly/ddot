import { request } from 'https';

async function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export async function checkBuildStatus(
  post,
  jobName,
  buildNumber,
  showConsoleText = true
): Promise<boolean> {
  const path = `${jobName}/${buildNumber}/api/json?tree=result`;
  while (true) {
    try {
      JSON.parse(await post(path));
      break;
    } catch (error) {
      await delay(500);
    }
  }
  const now = Date.now();
  while (true) {
    if (showConsoleText) {
      console.log(await post(`${jobName}/${buildNumber}/consoleText`));
    }
    const { result } = JSON.parse(await post(path));
    if (result === 'FAILURE' || Date.now() - now > 1000 * 5 * 60) {
      return false;
    }
    await delay(500);
    if (result === 'SUCCESS') {
      return true;
    }
  }
}

export async function toExec(post, params, jobName) {
  const path = `${jobName}/build`;
  const parameter = Object.keys(params).reduce(
    (preval, name) => [...preval, { name, value: params[name] }],
    []
  );
  return post(path, { parameter });
}

export async function nextBuildNumber(post, jobName): Promise<string> {
  const path = `${jobName}/api/json?tree=nextBuildNumber`;
  return /(\d+)/.exec(await post(path))[0];
}

export async function jenkisPost({ opts, token }, path, data = {}) {
  return new Promise<string>((resolve, reject) => {
    const body = `json=${encodeURIComponent(JSON.stringify(data))}`;
    const req = request(
      {
        hostname: opts.hostName,
        method: 'POST',
        auth: token,
        headers: {
          'Content-Length': Buffer.byteLength(body),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        path: `${opts.pathPrefix}/${path}`,
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
