/* eslint-disable max-classes-per-file */

import React from 'react';
import { create, act, ReactTestRenderer } from 'react-test-renderer';
import { Subject } from 'rxjs';
import { ReactiveClass } from './ReactiveClass';
import { useSelector } from './useSelector';

describe('useSelector', () => {
  it('update render when reactive class changed', () => {
    class Some1 extends ReactiveClass {
      num = 1;
    }
    class Some2 extends ReactiveClass {
      str = '1';
    }
    class Some3 extends ReactiveClass {
      arr = [1];
    }
    const some1 = new Some1();
    const some2 = new Some2();
    const some3 = new Some3();

    const Component = ({ s1, s2, s3 }: { s1: Some1; s2: Some2; s3: Some3 }) => {
      const prop = useSelector(() => {
        return [s1.num, s2.str, s3.arr];
      }, [s1, s2, s3]);
      return <>{JSON.stringify(prop)}</>;
    };

    let component!: ReactTestRenderer;
    void act(() => {
      component = create(<Component s1={some1} s2={some2} s3={some3} />);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(((some1 as any).subject as Subject<Some1>).observers.length).toBe(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(((some2 as any).subject as Subject<Some2>).observers.length).toBe(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(((some3 as any).subject as Subject<Some3>).observers.length).toBe(1);
    expect(component.toJSON()).toMatchSnapshot();

    void act(() => {
      some1.num = 2;
    });
    expect(component.toJSON()).toMatchSnapshot();

    void act(() => {
      some2.str = '2';
    });
    expect(component.toJSON()).toMatchSnapshot();

    void act(() => {
      some3.arr = [2];
    });
    expect(component.toJSON()).toMatchSnapshot();

    void act(() => {
      some1.num = 3;
    });
    expect(component.toJSON()).toMatchSnapshot();

    void act(() => {
      component.unmount();
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(((some1 as any).subject as Subject<Some1>).observers.length).toBe(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(((some2 as any).subject as Subject<Some2>).observers.length).toBe(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(((some3 as any).subject as Subject<Some3>).observers.length).toBe(0);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
