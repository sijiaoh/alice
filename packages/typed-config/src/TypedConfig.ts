import autobind from 'autobind-decorator';

export const envs = ['test', 'development', 'staging', 'production'] as const;

export type Env = typeof envs[number];

@autobind
export class TypedConfig<T extends { [key: string]: string | undefined }> {
  env: Env;
  data: { [key in keyof T]: string };

  constructor(env: Env, config: T) {
    this.env = env;

    const data: { [key: string]: string } = {};
    Object.keys(config).forEach((key) => {
      const envValue = process.env[key];
      const value = envValue ?? config[key];
      if (value == null) throw new Error(`${envValue} is not set.`);

      data[key] = value;
    });
    this.data = data as { [key in keyof T]: string };
  }

  get test() {
    return this.env === 'test';
  }

  get development() {
    return this.env === 'development';
  }

  get staging() {
    return this.env === 'staging';
  }

  get production() {
    return this.env === 'staging' || this.env === 'production';
  }
}
