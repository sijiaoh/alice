import { TypedConfig } from './TypedConfig';

describe(TypedConfig.name, () => {
  describe("env === 'staging'", () => {
    it('production is true', () => {
      const config = new TypedConfig('staging', {});
      expect(config.test).toBeFalsy();
      expect(config.development).toBeFalsy();
      expect(config.staging).toBeTruthy();
      expect(config.production).toBeTruthy();
    });
  });

  describe('data', () => {
    it('throw error when some value is undefined', () => {
      expect(() => {
        // eslint-disable-next-line no-new
        new TypedConfig('staging', { a: undefined });
      }).toThrow();
    });

    it('environment variables will overwrite config values', () => {
      jest.resetModules();
      const oldEnv = process.env;
      process.env = { ...oldEnv };

      process.env.A = 'b';
      const config = new TypedConfig('test', { A: 'a' });
      expect(config.data.A).toBe('b');

      jest.resetModules();
      process.env = oldEnv;
    });
  });
});
