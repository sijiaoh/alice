/* eslint-disable max-classes-per-file */

import { ReactiveClass } from './ReactiveClass';

afterEach(() => {
  jest.useRealTimers();
});

class SomeClass extends ReactiveClass {
  constructor() {
    super();
    this.num = 0;
    this.str = '0';
  }

  num: number;
  str: string;
  obj = { key: 0 };
}

describe(ReactiveClass.name, () => {
  describe(ReactiveClass.prototype.subscribe.name, () => {
    it('call callback function when class properties changed', async () => {
      jest.useFakeTimers();

      const some = new SomeClass();

      let count = 0;
      const unsubscribe = some.subscribe(() => {
        count += 1;
      });

      some.num += 1;
      some.str = '1';
      some.obj = { key: 1 };

      jest.runAllTimers();
      await Promise.resolve();

      unsubscribe();

      let count2 = 0;
      some.subscribe({
        onUpdate: () => {
          count2 += 1;
        },
      });

      some.num += 1;
      some.str = '2';
      some.obj = { key: 1 };

      jest.runAllTimers();
      await Promise.resolve();

      expect(some.num).toBe(2);
      expect(some.str).toBe('2');
      expect(some.obj.key).toBe(1);
      expect(count).toBe(1);
      expect(count2).toBe(1);
    });

    describe(ReactiveClass.prototype.setReactiveProps.name, () => {
      class SomeClass2 extends ReactiveClass {
        constructor() {
          super();
          this.setReactiveProps(['num', 'obj']);
          this.num = 0;
          this.str = '0';
        }

        num: number;
        str: string;
        obj = { key: 0 };
      }

      it('call callback function when class properties changed', async () => {
        jest.useFakeTimers();

        const some = new SomeClass2();

        let count = 0;
        const unsubscribe = some.subscribe(() => {
          count += 1;
        });

        some.num += 1;
        some.str = '1';
        some.obj = { key: 1 };

        jest.runAllTimers();
        await Promise.resolve();

        unsubscribe();

        let count2 = 0;
        some.subscribe({
          onUpdate: () => {
            count2 += 1;
          },
        });

        some.num += 1;
        some.obj = { key: 1 };

        jest.runAllTimers();
        await Promise.resolve();

        some.str = '2';

        jest.runAllTimers();
        await Promise.resolve();

        expect(some.num).toBe(2);
        expect(some.str).toBe('2');
        expect(some.obj.key).toBe(1);
        expect(count).toBe(1);
        expect(count2).toBe(1);
      });
    });
  });

  describe('destroy', () => {
    it('call subject.complete', async () => {
      let called = false;

      const some = new SomeClass();
      some.subscribe({
        onDestroy: () => {
          called = true;
        },
      });
      await some.destroy();

      expect(called).toBeTruthy();
    });
  });

  describe('reacting', () => {
    it('can control reactive feature', async () => {
      jest.useFakeTimers();

      let called = false;

      const some = new SomeClass();
      some.subscribe(() => {
        called = true;
      });

      some.num += 1;

      jest.runAllTimers();
      await Promise.resolve();
      expect(called).toBe(true);

      called = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (some as any).reacting = false;
      some.num += 1;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (some as any).reacting = true;

      jest.runAllTimers();
      await Promise.resolve();
      expect(called).toBeFalsy();
    });
  });
});
