import { useCallback, useMemo, useState } from 'react';
import { useMountedRef } from './useMountedRef';

export const useSafeState = <T>(def: T): [T, (v: T) => void] => {
  const mountedRef = useMountedRef();
  const [get, set] = useState<T>(def);

  const safeSet = useCallback(
    (v: T) => {
      if (mountedRef.current) set(v);
    },
    [mountedRef]
  );

  return useMemo(() => [get, safeSet], [get, safeSet]);
};
