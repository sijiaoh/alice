import { generate } from './generate';

describe('generate', () => {
  describe('with legal env', () => {
    it('generate env.ts', async () => {
      expect(await generate()).toMatchSnapshot();
    });
  });
  describe('with illegal env', () => {
    it('throw error', async () => {
      await expect(generate('test2')).rejects.toThrow();
    });
  });
});
