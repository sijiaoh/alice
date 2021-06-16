/* eslint-disable max-classes-per-file */

import { ReactiveClass } from './ReactiveClass';

class Store {
  count = 0;

  onChange() {
    this.count += 1;
  }
}

class SomeClass extends ReactiveClass {
  num = 0;
  str = '';
  obj = { key: 0 };
}

describe('ReactiveClass', () => {
  describe('change property', () => {
    it('to be trigger store onChange event', () => {
      const store = new Store();
      const some = new SomeClass({ store });

      some.num += 1;
      some.str = '';
      some.obj = { key: 1 };

      expect(some.num).toBe(1);
      expect(some.str).toBe('');
      expect(some.obj.key).toBe(1);
      expect(store.count).toBe(6);
    });
  });
});
