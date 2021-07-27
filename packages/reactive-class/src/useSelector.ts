import { useState, useEffect, useRef } from 'react';
import type { ReactiveClass } from './ReactiveClass';

export const useSelector = <T>(callback: () => T, rcs: ReactiveClass[]) => {
  // 最初の一回のみcallbackを呼び出す。
  const initedRef = useRef(false);
  const [value, setValue] = useState(
    initedRef.current
      ? (undefined as unknown as T)
      : () => {
          initedRef.current = true;
          return callback();
        }
  );

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
