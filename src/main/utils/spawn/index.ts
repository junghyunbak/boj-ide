import { spawn, execSync, spawnSync, type SpawnSyncOptions, type SpawnOptionsWithoutStdio } from 'child_process';

class CustomSpawn {
  private env: NodeJS.ProcessEnv = {};

  constructor() {
    // BUG: zsh shell 을 기본적으로 사용하지 않는 맥 환경에서는 오류가 발생할 수 있다.
    const shellEnv =
      process.platform === 'darwin'
        ? execSync('zsh -lic "printenv"', { encoding: 'utf-8' })
            .split('\n')
            .reduce<NodeJS.ProcessEnv>((env, line) => {
              const [key, value] = line.split('=');

              if (key && value) {
                env[key] = value;
              }

              return env;
            }, {})
        : {};

    const mergedPath = [process.env.PATH, shellEnv.PATH].filter(Boolean).join(':');

    this.env = { ...process.env, ...shellEnv, PATH: mergedPath };
  }

  getEnvPath() {
    const envPath = (() => {
      for (const [key, value] of Object.entries(this.env)) {
        if (key.toLowerCase() === 'path') {
          return value;
        }
      }

      return null;
    })();

    return envPath;
  }

  async(cmd: string, args: string[], options: SpawnOptionsWithoutStdio) {
    return spawn(cmd, args, { ...options, env: this.env });
  }

  sync(cmd: string, options: SpawnSyncOptions) {
    return spawnSync(cmd, { ...options, env: this.env });
  }
}

export const customSpawn = new CustomSpawn();

export function checkCli(cli: string): boolean {
  const { stdout } = customSpawn.sync(`${cli} --version`, { shell: true });

  if (!stdout) {
    return false;
  }

  return /[0-9]+\.[0-9]+\.[0-9]+/.test(stdout.toString());
}
