import { MouseEvent, KeyboardEvent } from 'react';
import { Props } from 'react-utils';

export interface HeaderButtonOnClick {
  (
    e:
      | MouseEvent<HTMLDivElement, globalThis.MouseEvent>
      | KeyboardEvent<HTMLDivElement>
  ): Promise<void> | void;
}

export const HeaderButton = ({
  className,
  onClick,
  children,
}: Props<{
  onClick: HeaderButtonOnClick;
}>) => {
  return (
    <div
      className={className}
      css={{
        minWidth: '1em',
        padding: '0 .5em',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: 'rgb(255,255,255)',
        ':hover': {
          backgroundColor: 'rgb(200,200,200)',
        },
      }}
      onClick={onClick}
      onKeyPress={onClick}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
};
