import { useState, useEffect } from 'react';
import { ReactiveClass } from './ReactiveClass';

export function useArraySelector<T1 extends ReactiveClass, R>(
  vs: [T1],
  callback: (vs: [T1]) => R
): void;
export function useArraySelector<
  T1 extends ReactiveClass,
  T2 extends ReactiveClass,
  R
>(vs: [T1, T2], callback: (vs: [T1, T2]) => R): void;
export function useArraySelector<
  T1 extends ReactiveClass,
  T2 extends ReactiveClass,
  T3 extends ReactiveClass,
  R
>(vs: [T1, T2, T3], callback: (vs: [T1, T2, T3]) => R): void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useArraySelector<T>(arg1: any, arg2: (vs: any) => T) {
  const vs = arg1 as ReactiveClass[];
  const callback = arg2 as (vs: ReactiveClass[]) => T;

  const [value, setValue] = useState(callback(vs));

  useEffect(() => {
    const unsubscribes = vs.map((v) => {
      return v.subscribe(() => {
        setValue(callback(vs));
      });
    });
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  return value;
}
