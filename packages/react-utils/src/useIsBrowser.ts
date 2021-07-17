import { useEffect, useState } from 'react';

export const useIsBrowser = () => {
  const [isBrowser, setIsBrowser] = useState(typeof window === 'undefined');
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  return isBrowser;
};
