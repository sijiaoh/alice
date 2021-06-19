/* eslint-disable max-classes-per-file */

import { ReactiveClass } from './ReactiveClass';

class SomeClass extends ReactiveClass {
  num = 0;
  str = '';
  obj = { key: 0 };
}

describe('ReactiveClass', () => {
  describe('subscribe', () => {
    it('call callback function when class properties changed', () => {
      const some = new SomeClass();

      let count = 0;
      const unsubscribe = some.subscribe(() => {
        count += 1;
      });

      some.num += 1;
      some.str = '';
      some.obj = { key: 1 };

      unsubscribe();

      let count2 = 0;
      some.subscribe({
        next: () => {
          count2 += 1;
        },
      });

      some.num += 1;
      some.str = '';
      some.obj = { key: 1 };

      expect(some.num).toBe(2);
      expect(some.str).toBe('');
      expect(some.obj.key).toBe(1);
      expect(count).toBe(3);
      expect(count2).toBe(3);
    });
  });

  describe('destroy', () => {
    it('call subject.complete', () => {
      let called = false;

      const some = new SomeClass();
      some.subscribe({
        complete: () => {
          called = true;
        },
      });
      some.destroy();

      expect(called).toBe(true);
    });
  });
});
