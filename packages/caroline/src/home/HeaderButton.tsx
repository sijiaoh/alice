import { Props } from 'react-utils';

export const HeaderButton = ({
  onClick,
  children,
}: Props<{ onClick: () => Promise<void> | void }>) => {
  return (
    <div
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
