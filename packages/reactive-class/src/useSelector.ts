import { useState, useEffect } from 'react';
import { ReactiveClass } from './ReactiveClass';

export const useSelector = <T extends ReactiveClass, R>(
  v: T,
  callback: (v: T) => R
) => {
  const [value, setValue] = useState(callback(v));

  useEffect(() => {
    const subscription = v.observable.subscribe((lv) => {
      setValue(callback(lv));
    });
    return () => subscription.unsubscribe();
  }, []);

  return value;
};
