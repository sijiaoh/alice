import React from 'react';
import { create, act } from 'react-test-renderer';
import { ReactiveClass } from './ReactiveClass';

class SomeClass extends ReactiveClass<{
  num: number;
  str: string;
  obj: { key: number };
}> {
  constructor(key: string) {
    super(key, { num: 0, str: '0', obj: { key: 0 } });
  }
}

describe(ReactiveClass.name, () => {
  describe(ReactiveClass.prototype.changeValue.name, () => {
    it('will update state', () => {
      const some = new SomeClass('some');

      const Component = () => {
        return <ReactiveClass.Provider />;
      };

      void act(() => {
        create(<Component />);
      });

      void act(() => {
        some.changeValue((state) => {
          state.num += 1;
          state.str = '1';
          state.obj.key = 1;
        });
      });

      expect(some.data.num).toBe(1);
      expect(some.data.str).toBe('1');
      expect(some.data.obj.key).toBe(1);

      void act(() => {
        some.data = {
          ...some.data,
          num: some.data.num + 1,
          str: '2',
        };
      });

      expect(some.data.num).toBe(2);
      expect(some.data.str).toBe('2');
      expect(some.data.obj.key).toBe(1);
    });
  });
});
