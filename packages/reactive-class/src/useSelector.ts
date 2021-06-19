import { useState, useEffect } from 'react';
import { ReactiveClass } from './ReactiveClass';

export const useSelector = <T>(callback: () => T, rcs: ReactiveClass[]) => {
  const [value, setValue] = useState(callback());

  useEffect(() => {
    const unsubscribes = rcs.map((rc) =>
      rc.subscribe(() => {
        setValue(callback());
      })
    );
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, rcs);

  return value;
};
