import { Props } from 'react-utils';

export const Row = ({ className, children }: Props) => {
  return (
    <div
      className={className}
      css={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
};
