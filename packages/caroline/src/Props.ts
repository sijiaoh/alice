import { ReactNode } from 'react';

export type Props<T = Record<string, unknown>> = {
  className?: string;
  children?: ReactNode;
} & T;
