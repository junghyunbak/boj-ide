import { spawn, execSync, spawnSync, type SpawnSyncOptions, type SpawnOptionsWithoutStdio } from 'child_process';

class CustomSpawn {
  private env: NodeJS.ProcessEnv = {};

  constructor() {
    // [ ]: zsh shell 을 기본적으로 사용하지 않는 맥 환경에서는 오류가 발생할 수 있다.
    const shellEnv =
      process.platform === 'darwin'
        ? execSync('zsh -i -c "printenv"', { encoding: 'utf-8' })
            .split('\n')
            .reduce<NodeJS.ProcessEnv>((env, line) => {
              const [key, value] = line.split('=');

              if (key && value) {
                env[key] = value;
              }

              return env;
            }, {})
        : {};

    this.env = { ...process.env, ...shellEnv };
  }

  async(cmd: string, options: SpawnOptionsWithoutStdio) {
    return spawn(cmd, { ...options, env: this.env });
  }

  sync(cmd: string, options: SpawnSyncOptions) {
    return spawnSync(cmd, { ...options, env: this.env });
  }
}

export const customSpawn = new CustomSpawn();
