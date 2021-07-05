import autobind from 'autobind-decorator';

type Env = 'test' | 'development' | 'staging' | 'production';

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
      if (value == null) throw new Error(`${envValue} is falsy.`);

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
