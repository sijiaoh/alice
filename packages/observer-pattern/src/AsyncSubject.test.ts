import { AsyncSubject } from './AsyncSubject';

afterEach(() => {
  jest.useRealTimers();
});

describe(AsyncSubject.name, () => {
  describe('update', () => {
    // asyncテストはしない。
    // https://github.com/facebook/jest/issues/7151
    it('will be call observers onUpdate with setTimeout', () => {
      jest.useFakeTimers();

      const subject = new AsyncSubject();

      let calledFunc = false;
      let calledUpdate = false;

      subject.subscribe(() => {
        calledFunc = true;
      });
      subject.subscribe({
        onUpdate: () => {
          calledUpdate = true;
        },
      });

      subject.update();

      expect(calledFunc).toBeFalsy();
      expect(calledUpdate).toBeFalsy();

      jest.runAllTimers();

      expect(calledFunc).toBeTruthy();
      expect(calledUpdate).toBeTruthy();
    });
  });

  describe('destroy', () => {
    it('will be call observers onDestroy', async () => {
      const subject = new AsyncSubject();

      let calledDestroy = false;
      subject.subscribe({
        onDestroy: () => {
          calledDestroy = true;
        },
      });

      await subject.destroy();
      expect(calledDestroy).toBeTruthy();
    });
  });
});
