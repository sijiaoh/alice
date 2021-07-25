import { AsyncSubject } from './AsyncSubject';

afterEach(() => {
  jest.useRealTimers();
});

describe(AsyncSubject.name, () => {
  describe(AsyncSubject.prototype.update.name, () => {
    // asyncテストはしない。
    // https://github.com/facebook/jest/issues/7151
    it('will be call observers onUpdate with setTimeout', async () => {
      jest.useFakeTimers();

      const subject = new AsyncSubject();

      let calledExecFuncCount = 0;
      let calledFuncCount = 0;
      let calledUpdateCount = 0;
      let calledAsyncFuncCount = 0;
      let calledAsyncUpdateCount = 0;

      void subject.execAndSubscribe(() => {
        calledExecFuncCount += 1;
      });
      subject.subscribe(() => {
        calledFuncCount += 1;
      });
      subject.subscribe({
        onUpdate: () => {
          calledUpdateCount += 1;
        },
      });
      subject.subscribe(async () => {
        await Promise.resolve();
        calledAsyncFuncCount += 1;
      });
      subject.subscribe({
        onUpdate: async () => {
          await Promise.resolve();
          calledAsyncUpdateCount += 1;
        },
      });

      jest.runAllTimers();
      await Promise.resolve();

      subject.update();

      expect(calledExecFuncCount).toBe(1);
      expect(calledFuncCount).toBe(0);
      expect(calledUpdateCount).toBe(0);
      expect(calledAsyncFuncCount).toBe(0);
      expect(calledAsyncUpdateCount).toBe(0);

      jest.runAllTimers();
      await Promise.resolve();
      // 一回だと動かない。
      // TODO: 調査する。
      await Promise.resolve();
      expect(calledExecFuncCount).toBe(2);
      expect(calledFuncCount).toBe(1);
      expect(calledUpdateCount).toBe(1);
      expect(calledAsyncFuncCount).toBe(1);
      expect(calledAsyncUpdateCount).toBe(1);

      subject.update();

      jest.runAllTimers();
      await Promise.resolve();
      expect(calledExecFuncCount).toBe(3);
      expect(calledFuncCount).toBe(2);
      expect(calledUpdateCount).toBe(2);
      expect(calledAsyncFuncCount).toBe(2);
      expect(calledAsyncUpdateCount).toBe(2);
    });
  });

  describe(AsyncSubject.prototype.destroy.name, () => {
    it('will be call observers onDestroy', async () => {
      const subject = new AsyncSubject();

      let calledDestroy = false;
      let calledAsyncDestroy = false;

      subject.subscribe({
        onDestroy: () => {
          calledDestroy = true;
        },
      });
      subject.subscribe({
        onDestroy: async () => {
          calledAsyncDestroy = await Promise.resolve(true);
        },
      });

      await subject.destroy();
      expect(calledDestroy).toBeTruthy();
      expect(calledAsyncDestroy).toBeTruthy();
    });
  });
});
