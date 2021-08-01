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
  describe(ReactiveClass.prototype.changeState.name, () => {
    it('will update state', () => {
      const some = new SomeClass('some');

      const Component = () => {
        return <ReactiveClass.Provider />;
      };

      void act(() => {
        create(<Component />);
      });

      void act(() => {
        some.changeState((state) => {
          state.num += 1;
          state.str = '1';
          state.obj.key = 1;
        });
      });

      const state1 = some.getState();
      expect(state1.num).toBe(1);
      expect(state1.str).toBe('1');
      expect(state1.obj.key).toBe(1);

      void act(() => {
        some.changeState((state) => {
          state.num += 1;
          state.str = '2';
        });
      });

      const state2 = some.getState();
      expect(state2.num).toBe(2);
      expect(state2.str).toBe('2');
      expect(state2.obj.key).toBe(1);
    });
  });
});
