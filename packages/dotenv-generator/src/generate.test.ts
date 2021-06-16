import { generate } from './generate';

describe('generate', () => {
  describe('with legal env', () => {
    it('generate env.ts', () => {
      expect(generate()).toMatchSnapshot();
    });
  });
  describe('with illegal env', () => {
    it('throw error', () => {
      expect(() => {
        generate('test2');
      }).toThrow();
    });
  });
});
