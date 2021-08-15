import { MouseEvent, KeyboardEvent } from 'react';
import { Props } from 'react-utils';
import { Button } from '../Button';

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
    <Button
      className={className}
      css={{
        minWidth: '1em',
        padding: '0 .5em',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: 'rgb(255,255,255)',
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
