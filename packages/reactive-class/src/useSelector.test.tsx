/* eslint-disable max-classes-per-file */

import React from 'react';
import { create, act, ReactTestRenderer } from 'react-test-renderer';
import { ReactiveClass } from './ReactiveClass';
import { useSelector } from './useSelector';

afterEach(() => {
  jest.useRealTimers();
});

describe('useSelector', () => {
  it('update render when reactive class changed', async () => {
    jest.useFakeTimers();

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
    expect(Object.values(some1.subject.observerDatas).length).toBe(1);
    expect(Object.values(some2.subject.observerDatas).length).toBe(1);
    expect(Object.values(some3.subject.observerDatas).length).toBe(1);
    expect(component.toJSON()).toMatchSnapshot();

    await act(async () => {
      some1.num = 2;
      jest.runAllTimers();
      await Promise.resolve();
    });
    expect(component.toJSON()).toMatchSnapshot();

    await act(async () => {
      some2.str = '2';
      jest.runAllTimers();
      await Promise.resolve();
    });
    expect(component.toJSON()).toMatchSnapshot();

    await act(async () => {
      some3.arr = [2];
      jest.runAllTimers();
      await Promise.resolve();
    });
    expect(component.toJSON()).toMatchSnapshot();

    await act(async () => {
      some1.num = 3;
      jest.runAllTimers();
      await Promise.resolve();
    });
    expect(component.toJSON()).toMatchSnapshot();

    void act(() => {
      component.unmount();
    });
    expect(Object.values(some1.subject.observerDatas).length).toBe(0);
    expect(Object.values(some2.subject.observerDatas).length).toBe(0);
    expect(Object.values(some3.subject.observerDatas).length).toBe(0);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
