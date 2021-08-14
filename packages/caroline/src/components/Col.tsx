import { Props } from 'react-utils';

export const Col = ({ className, children }: Props) => {
  return (
    <div
      className={className}
      css={{ maxWidth: '720px', width: '100%', padding: '1em' }}
    >
      {children}
    </div>
  );
};
