export type AsyncObserver =
  | (() => Promise<void> | void)
  | {
      onUpdate?: () => Promise<void> | void;
      onDestroy?: () => Promise<void> | void;
    };
