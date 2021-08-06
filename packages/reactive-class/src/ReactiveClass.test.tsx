import { flushPromises } from 'test-utils';
import React from 'react';
import { create, act, ReactTestRenderer } from 'react-test-renderer';
import { ReactiveClass } from './ReactiveClass';

class SomeClass extends ReactiveClass<{
  num: number;
  str: string;
  obj: { key: number };
}> {
  constructor() {
    super({ num: 0, str: '0', obj: { key: 0 } });
  }
}

describe(ReactiveClass.name, () => {
  describe(ReactiveClass.prototype.changeData.name, () => {
    it('will update data', () => {
      const some = new SomeClass();

      some.changeData((data) => {
        data.num += 1;
        data.str = '1';
        data.obj.key = 1;
      });

      expect(some.data.num).toBe(1);
      expect(some.data.str).toBe('1');
      expect(some.data.obj.key).toBe(1);

      some.data = {
        ...some.data,
        num: some.data.num + 1,
        str: '2',
      };

      expect(some.data.num).toBe(2);
      expect(some.data.str).toBe('2');
      expect(some.data.obj.key).toBe(1);
    });
  });

  describe(ReactiveClass.prototype.subscribe, () => {
    describe('selector value is not array or object', () => {
      it('call callback when value changed', async () => {
        const some = new SomeClass();

        let updateCount = 0;
        some.subscribe(
          (data) => data.num,
          () => {
            updateCount += 1;
          }
        );

        some.changeData((data) => {
          data.num += 1;
        });
        await flushPromises();
        expect(updateCount).toBe(1);

        some.changeData((data) => {
          data.obj.key += 1;
        });
        await flushPromises();
        expect(updateCount).toBe(1);
      });
    });

    describe('selector value is array or object', () => {
      it('call callback when inner value changed', async () => {
        const some = new SomeClass();

        let updateCount = 0;
        some.subscribe(
          (data) => [data.num, data.str],
          () => {
            updateCount += 1;
          }
        );

        some.changeData((data) => {
          data.num += 1;
        });
        await flushPromises();
        expect(updateCount).toBe(1);

        some.changeData((data) => {
          data.obj.key += 1;
        });
        await flushPromises();
        expect(updateCount).toBe(1);
      });
    });

    it('return unsubscribe', async () => {
      const some = new SomeClass();

      let updateCount = 0;
      const unsubscribe = some.subscribe(() => {
        updateCount += 1;
      });

      some.changeData((data) => {
        data.num += 1;
      });
      await flushPromises();
      expect(updateCount).toBe(1);

      unsubscribe();

      some.changeData((data) => {
        data.num += 1;
      });
      await flushPromises();
      expect(updateCount).toBe(1);
    });
  });

  describe(ReactiveClass.prototype.useSelector.name, () => {
    it('rerender component when selected value changed', async () => {
      const some = new SomeClass();

      const Component = () => {
        const str = some.useSelector((data) => data.str);
        return <>{[str, some.data.num]}</>;
      };
      let testRenderer!: ReactTestRenderer;

      await act(async () => {
        testRenderer = create(<Component></Component>);
        await flushPromises();
      });
      expect(testRenderer.toJSON()).toMatchSnapshot();

      await act(async () => {
        some.changeData((data) => {
          data.str = 'hello';
        });
        await flushPromises();
      });
      expect(testRenderer.toJSON()).toMatchSnapshot();

      await act(async () => {
        some.changeData((data) => {
          data.num += 1;
        });
        await flushPromises();
      });
      expect(testRenderer.toJSON()).toMatchSnapshot();

      await act(async () => {
        some.changeData((data) => {
          data.str = 'hello2';
        });
        await flushPromises();
      });
      expect(testRenderer.toJSON()).toMatchSnapshot();
    });
  });
});
