import { useState, useEffect } from 'react';
import { ReactiveClass } from './ReactiveClass';

export const useSelector = <T extends ReactiveClass, R>(
  v: T,
  callback: (v: T) => R
) => {
  const [value, setValue] = useState(callback(v));

  useEffect(() => {
    return v.subscribe((lv) => {
      setValue(callback(lv));
    });
  }, []);

  return value;
};
