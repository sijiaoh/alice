import classNames from 'classnames';
import { useCallback, useMemo, MouseEvent, KeyboardEvent } from 'react';
import { Props, useSafeState } from 'react-utils';

type E =
  | MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  | KeyboardEvent<HTMLDivElement>;

export interface HeaderButtonOnClick {
  (e: E): Promise<void> | void;
}

export const Button = ({
  className,
  onClick,
  children,
}: Props<{
  onClick: HeaderButtonOnClick;
}>) => {
  const [disabled, setDisabled] = useSafeState(false);
  const callback = useCallback(
    async (e: E) => {
      if (disabled) return;
      setDisabled(true);
      try {
        await onClick(e);
      } finally {
        setDisabled(false);
      }
    },
    [disabled, onClick, setDisabled]
  );

  return useMemo(
    () => (
      <div
        className={classNames(className, { disabled })}
        onClick={async (e) => callback(e)}
        onKeyPress={callback}
        role="button"
        tabIndex={0}
        css={{
          ':hover': {
            backgroundColor: 'rgb(200,200,200)',
          },
          '&.disabled': {
            color: 'rgb(100,100,100)',
            backgroundColor: 'rgb(180,180,180)',
            ':hover': {
              cursor: 'not-allowed',
            },
          },
        }}
      >
        {children}
      </div>
    ),
    [callback, children, className, disabled]
  );
};
