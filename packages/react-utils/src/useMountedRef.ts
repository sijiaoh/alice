import { useEffect, useRef } from 'react';

export const useMountedRef = () => {
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  return mountedRef;
};
