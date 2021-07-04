export type Observer =
  | (() => void)
  | {
      onUpdate?: () => void;
      onDestroy?: () => void;
    };
